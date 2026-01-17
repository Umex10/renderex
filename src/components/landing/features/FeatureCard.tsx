import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface FeatureCardArgs {
  headerTitle: string,
  mainContent: string,
  footerContent: string | React.ReactNode,
  classes?: string
}

const FeatureCard = ({headerTitle, mainContent, footerContent, classes}: FeatureCardArgs) => {
  return (
   
      <Card className={`h-full p-4 bg-black flex flex-col items-center
       ${classes ? classes : ""}`}>
        <CardHeader>
          <CardTitle>{headerTitle}</CardTitle>
        </CardHeader>

        <CardContent>
          {mainContent}
        </CardContent>

        <CardFooter className="flex-1">
          {footerContent}
        </CardFooter>
      </Card>
  )
}

export default FeatureCard
