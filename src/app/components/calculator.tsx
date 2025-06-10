"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Info, AlertTriangle, CheckCircle, Code, Lightbulb, BookOpen } from "lucide-react"

export default function StringCalculator() {
    const [input, setInput] = useState("")
    const [result, setResult] = useState<number | null>(null)
    const [error, setError] = useState("")
    const [processing, setProcessing] = useState(false)

    const add = (numbers: string): number => {
        if (numbers === "") return 0

        // Convert literal "\n" to actual newline if needed (for test environments or string inputs)
        numbers = numbers.replace(/\\n/g, "\n")

        let delimiterRegex = /[,\n]/  // default delimiters
        let numbersString = numbers

        // Custom delimiter support: format like //;\n1;2
        if (numbers.startsWith("//")) {
            const match = numbers.match(/^\/\/(.+)\n/)
            if (match) {
                const customDelimiter = match[1]
                const escapedDelimiter = customDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                delimiterRegex = new RegExp(escapedDelimiter)  // override delimiter
                numbersString = numbers.substring(numbers.indexOf("\n") + 1)
            }
        }

        const numberArray = numbersString.split(delimiterRegex).filter(n => n.trim() !== "")
        const parsedNumbers = numberArray.map(n => parseInt(n, 10))

        const negativeNumbers = parsedNumbers.filter(n => n < 0)
        if (negativeNumbers.length > 0) {
            throw new Error(`negative numbers not allowed ${negativeNumbers.join(", ")}`)
        }

        return parsedNumbers.reduce((sum, num) => sum + num, 0)
    }

    const handleCalculate = async () => {
        setProcessing(true)
        setError("")
        setResult(null)

        try {
            await new Promise((resolve) => setTimeout(resolve, 300))
            const calculationResult = add(input)
            setResult(calculationResult)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setProcessing(false)
        }
    }

    const examples = [
        { input: '""', output: "0", desc: "Empty string" },
        { input: '"1"', output: "1", desc: "Single number" },
        { input: '"1,5"', output: "6", desc: "Comma separated" },
        { input: '"1\\n2,3"', output: "6", desc: "Mixed delimiters" },
        { input: '"//;\\n1;2"', output: "3", desc: "Custom delimiter" },
        { input: '"1,-2"', output: "Error", desc: "Negative numbers" },
    ]

    const tips = [
        "Start with empty string",
        "Handle single numbers",
        "Support multiple numbers",
        "Add newline delimiters",
        "Custom delimiter support",
        "Validate negative numbers",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                        <Calculator className="h-7 w-7 text-indigo-600" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            String Calculator TDD Kata
                        </h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Test-Driven Development exercise for building a progressive string calculator
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg border border-slate-200 bg-white h-full">
                            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Code className="h-5 w-5" />
                                    Calculator
                                </CardTitle>
                                <CardDescription className="text-indigo-100">Enter your string and calculate the sum</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="calculator-input" className="text-sm font-medium text-slate-700">
                                        Input String
                                    </label>
                                    <Input
                                        id="calculator-input"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder='Try: 1,2,3 or //;\n1;2;3'
                                        className="text-lg p-3 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <Button
                                    onClick={handleCalculate}
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-3 text-lg font-medium"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Calculator className="h-4 w-4 mr-2" />
                                            Calculate Sum
                                        </>
                                    )}
                                </Button>

                                {result !== null && (
                                    <Alert className="border-emerald-200 bg-emerald-50">
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                        <AlertDescription className="text-emerald-800">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Result:</span>
                                                <Badge className="text-xl px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                    {result}
                                                </Badge>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {error && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            <span className="font-medium">Error:</span> {error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 space-y-4 overflow-y-auto">
                        <Card className="shadow-md border border-slate-200 bg-white">
                            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Info className="h-4 w-4" />
                                    Examples
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="space-y-2">
                                    {examples.map((example, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <code className="text-xs font-mono bg-white px-2 py-1 rounded text-teal-600 border">
                                                    {example.input}
                                                </code>
                                                <p className="text-xs text-slate-600 mt-1">{example.desc}</p>
                                            </div>
                                            <Badge variant={example.output === "Error" ? "destructive" : "secondary"} className="text-xs">
                                                {example.output}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md border border-slate-200 bg-white">
                            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4" />
                                    Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="space-y-2 text-xs text-slate-700">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Empty String:</span>
                                        <Badge variant="outline" className="text-xs">
                                            Returns 0
                                        </Badge>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Delimiters:</span>
                                        <Badge variant="outline" className="text-xs">
                                            Comma, Newline
                                        </Badge>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Custom Format:</span>
                                        <Badge variant="outline" className="text-xs">
                      //[del]\n[nums]
                                        </Badge>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Negatives:</span>
                                        <Badge variant="destructive" className="text-xs">
                                            Exception
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Reference */}
                        <Card className="shadow-md border border-slate-200 bg-white">
                            <CardHeader className="bg-gradient-to-r from-slate-500 to-gray-500 text-white py-3">
                                <CardTitle className="text-base">Quick Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="space-y-1 text-xs text-slate-600">
                                    <div>
                                        <strong>Basic:</strong> "1,2,3" → 6
                                    </div>
                                    <div>
                                        <strong>Mixed:</strong> "1\n2,3" → 6
                                    </div>
                                    <div>
                                        <strong>Custom:</strong> "//;\n1;2" → 3
                                    </div>
                                    <div>
                                        <strong>Error:</strong> "1,-2" → Exception
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
