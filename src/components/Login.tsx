import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LoginProps {
    onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (username === 'dima' && password === 'dima123') {
            setError('')
            onLogin()
        } else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access B2Breeze
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                variant={error ? "error" : "default"}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                variant={error ? "error" : "default"}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive text-center">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="mt-6 text-xs text-muted-foreground text-center">
                        Demo credentials: dima / dima123
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
