import { useAi } from "@/hooks/ai/use-ai";
import { renderHook } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { aiDo } from "@/actions/ai";
import { setAiState } from "../../../redux/slices/aiSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn()
}))

jest.mock("@/actions/ai", () => ({
  aiDo: jest.fn()
}))

afterEach(() => {
  jest.useRealTimers();
});

describe("useAi hook", () => {

  it("should generate a note and return it", async () => {

    jest.useFakeTimers();

    const content = "# Java note";
    const activeMode = "summarize-sandbox";
    const isTryAgainActive = false;
    const sandboxContent = "Some text";

    const dispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);

    (aiDo as jest.Mock).mockReturnValue("text");

    const { result } = renderHook(() => useAi());

    for (const fn of [result.current.handleSummarize, result.current.handleStructure]) {
      await fn(content, activeMode, isTryAgainActive,
        sandboxContent
      );

      for (const i of [content, activeMode, isTryAgainActive, sandboxContent]) {
        expect(aiDo).toHaveBeenCalledWith(
          expect.stringContaining(`${i}`)
        );
      }

      expect(dispatch).toHaveBeenNthCalledWith(1, setAiState("generating"));
      expect(dispatch).toHaveBeenNthCalledWith(2, setAiState("finished"));

      jest.advanceTimersByTime(1500);
      expect(dispatch).toHaveBeenCalledWith(setAiState("idle"));


    }
  });

  it("should throw an error", async () => {

    const content = "# Java note";
    const activeMode = "summarize-sandbox";
    const isTryAgainActive = false;
    const sandboxContent = "Some text";

    const dispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);

    (aiDo as jest.Mock).mockReturnValue("");

    const { result } = renderHook(() => useAi());

    await expect(
      result.current.handleSummarize(content, activeMode,
        isTryAgainActive, sandboxContent)
    ).rejects.toThrow("AI res was empty or failed");

    await expect(
      result.current.handleStructure(content, activeMode,
        isTryAgainActive, sandboxContent)
    ).rejects.toThrow("AI res was empty or failed");

    expect(dispatch).toHaveBeenCalledWith(setAiState("error"));
  });


})