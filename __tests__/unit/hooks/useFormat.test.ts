import { useFormat } from "@/hooks/format/use-format";
import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";

import { getDOCX, getPDF, getTXT } from "@/actions/format";
import { NotesArgs } from "@/types/notesArgs";
import { triggerDownload } from "@/utils/download/triggerDownload";

jest.mock("react-redux", () => ({
  useSelector: jest.fn()
}))

jest.mock("@/actions/format", () => ({
  getDOCX: jest.fn(),
  getPDF: jest.fn(),
  getTXT: jest.fn()
}))

jest.mock("@/utils/download/triggerDownload", () => ({
  triggerDownload: jest.fn()
}))

describe("useFormat hook", () => {

  it("should use the triggerDownload function with markdown ars", async () => {

    (useSelector as unknown as jest.Mock).mockReturnValue("md");

    const { result } = renderHook(() => useFormat());

    const note: NotesArgs = {
      id: "#23ds",
      title: "Java",
      content: "Was geht",
      date: new Date(Date.now()).toISOString(),
      tags: [{ name: "java", color: "#F2a5FF" }],
      userId: "#5232"
    }

    await result.current.handleDownload(note)

    expect(triggerDownload).toHaveBeenCalledWith(
      note.content,
      `${note.title}.md`,
      "text/markdown"
    )
  });

  it("should not use the handleDownload() due to an error", async () => {

    (useSelector as unknown as jest.Mock).mockReturnValue(undefined);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

    const { result } = renderHook(() => useFormat());

    const note: NotesArgs = {
      id: "#23ds",
      title: "Java",
      content: "Was geht",
      date: new Date(Date.now()).toISOString(),
      tags: [{ name: "java", color: "#F2a5FF" }],
      userId: "#5232"
    }

    await result.current.handleDownload(note);

    expect(consoleSpy).toHaveBeenCalledWith(
      "An error occurred while downloading the file:",
      expect.any(Error)
    )

    consoleSpy.mockRestore();

  });

  it("should use the triggerDownload function with markdown ars", async () => {

    (useSelector as unknown as jest.Mock).mockReturnValue("docx");

    const { result } = renderHook(() => useFormat());

    const note: NotesArgs = {
      id: "#23ds",
      title: "Java",
      content: "Was geht",
      date: new Date(Date.now()).toISOString(),
      tags: [{ name: "java", color: "#F2a5FF" }],
      userId: "#5232"
    }

    const docBuffer = new Uint8Array([1, 2, 3]);
    (getDOCX as jest.Mock).mockResolvedValue(docBuffer);

    await result.current.handleDownload(note)

    expect(triggerDownload).toHaveBeenCalledWith(
      docBuffer,
      `${note.title}.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  });

  it("should use the triggerDownload function with markdown ars", async () => {

    (useSelector as unknown as jest.Mock).mockReturnValue("pdf");

    const { result } = renderHook(() => useFormat());

    const note: NotesArgs = {
      id: "#23ds",
      title: "Java",
      content: "Was geht",
      date: new Date(Date.now()).toISOString(),
      tags: [{ name: "java", color: "#F2a5FF" }],
      userId: "#5232"
    }

    const pdfBuffer = new Uint8Array([1, 2, 3]);
    (getPDF as jest.Mock).mockResolvedValue(pdfBuffer);

    await result.current.handleDownload(note)

    expect(triggerDownload).toHaveBeenCalledWith(
      pdfBuffer,
      `${note.title}.pdf`,
      "application/pdf"
    )
  });

   it("should use the triggerDownload function with markdown ars", async () => {

    (useSelector as unknown as jest.Mock).mockReturnValue("txt");

    const { result } = renderHook(() => useFormat());

    const note: NotesArgs = {
      id: "#23ds",
      title: "Java",
      content: "Was geht",
      date: new Date(Date.now()).toISOString(),
      tags: [{ name: "java", color: "#F2a5FF" }],
      userId: "#5232"
    }

    const text = "Servus";

    (getTXT as jest.Mock).mockResolvedValue(text);

    await result.current.handleDownload(note)

    expect(triggerDownload).toHaveBeenCalledWith(
      text,
      `${note.title}.txt`,
      "text/plain"
    )
  });

})