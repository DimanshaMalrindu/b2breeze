import { useState, useEffect } from 'react'
import { HomePage } from '@/pages/HomePage'
import { BusinessCardScannerPage } from '@/pages/BusinessCardScannerPage'
import { BusinessCardWalletPage } from '@/pages/BusinessCardWalletPage'
import { CustomerDirectoryPage } from '@/pages/CustomerDirectoryPage'
import { TaskPlannerPage } from '@/pages/TaskPlannerPage'
import { CampaignPlannerPage } from '@/pages/CampaignPlannerPage'
import { InvoiceGeneratorPage } from '@/pages/InvoiceGeneratorPage'
import { AnalyticsDashboardPage } from '@/pages/AnalyticsDashboardPage'
import { ConversationRecorderPage } from '@/pages/ConversationRecorderPage'
import { NavigationHeader } from '@/components/NavigationHeader'
import { Login } from '@/components/Login'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedAuth = localStorage.getItem('b2breeze-auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('b2breeze-auth', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('b2breeze-auth')
    setCurrentPage('home')
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'business-card-scanner':
      case 'scanner':
        return <BusinessCardScannerPage onBack={() => handleNavigate('home')} />
      case 'business-card-wallet':
      case 'wallet':
        return <BusinessCardWalletPage onNavigate={handleNavigate} />
      case 'customer-directory':
        return <CustomerDirectoryPage onNavigate={handleNavigate} />
      case 'task-planner':
        return <TaskPlannerPage onNavigate={handleNavigate} />
      case 'campaign-planner':
        return <CampaignPlannerPage onNavigate={handleNavigate} />
      case 'invoice-generator':
        return <InvoiceGeneratorPage onNavigate={handleNavigate} />
      case 'analytics-dashboard':
        return <AnalyticsDashboardPage onNavigate={handleNavigate} />
      case 'conversation-recorder':
        return <ConversationRecorderPage onNavigate={handleNavigate} />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <NavigationHeader
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
          <main>
            {renderCurrentPage()}
          </main>
        </>
      )}
    </div>
  )
}

export default App