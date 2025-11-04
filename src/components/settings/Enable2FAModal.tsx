"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"
import { DialogOverlay } from "@radix-ui/react-dialog"

interface Enable2FAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Enable2FAModal({ open, onOpenChange }: Enable2FAModalProps) {
  const [firstNumber, setFirstNumber] = useState("5")
  const [operator, setOperator] = useState("+")
  const [secondNumber, setSecondNumber] = useState("3")
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const calculateCorrectAnswer = () => {
    const num1 = Number.parseInt(firstNumber)
    const num2 = Number.parseInt(secondNumber)

    switch (operator) {
      case "+": return num1 + num2
      case "-": return num1 - num2
      case "*": return num1 * num2
      case "/": return Math.floor(num1 / num2)
      default: return 0
    }
  }

  const correctAnswer = calculateCorrectAnswer()
  const mathQuestion = `${firstNumber} ${operator} ${secondNumber}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!answer) return setError("Please enter an answer")

    if (Number.parseInt(answer) === correctAnswer) {
      setError("Answer must be different from the correct result. Choose a security answer that only you know like (number, letters or symbols).")
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setAnswer("")
      }, 1500)
    } catch {
      setError("Failed to enable 2FA. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent className="sm:max-w-md border-0 bg-modal text-foreground shadow-xl transition-colors">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Enable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Set up a custom security question to add an extra layer of protection to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Math Question Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Choose Your Security Question
            </label>
            <p className="text-xs text-muted-foreground">
              Create a math question that only you can answer. The answer should be anything you know like (number, letters or symbols) — not the real result.
            </p>

            {/* Math input row */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor="first-number" className="text-xs font-medium text-muted-foreground">
                  Number
                </label>
                <select
                  id="first-number"
                  value={firstNumber}
                  onChange={(e) => setFirstNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm text-foreground"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="operator" className="text-xs font-medium text-muted-foreground">
                  Operator
                </label>
                <select
                  id="operator"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm text-foreground"
                >
                  <option value="+">+</option>
                  <option value="-">−</option>
                  <option value="*">×</option>
                  <option value="/">÷</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="second-number" className="text-xs font-medium text-muted-foreground">
                  Number
                </label>
                <select
                  id="second-number"
                  value={secondNumber}
                  onChange={(e) => setSecondNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm text-foreground"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-md bg-secondary/70 border border-border">
              <p className="text-sm font-medium text-foreground">
                Your question: <span className="font-semibold">{mathQuestion} = ?</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Correct answer: {correctAnswer}</p>
            </div>
          </div>

          {/* Answer Field */}
          <div className="space-y-2">
            <label htmlFor="answer" className="text-sm font-medium text-foreground">
              Your Security Answer
            </label>
            <p className="text-xs text-red-400">
              Enter an answer that only you know like (number, letters or symbols). This should NOT be the correct result.
            </p>
            <Input
              id="answer"
              type="text"
              placeholder="Enter your security answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="size-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <CheckCircle className="size-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">
                2FA enabled successfully!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border text-muted-foreground hover:bg-secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
              disabled={isLoading || !answer}
            >
              {isLoading ? "Enabling..." : "Enable 2FA"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
