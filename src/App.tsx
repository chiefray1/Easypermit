import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SiteLayout, ScrollToTop } from './components/SiteLayout'
import { Analytics, ConsentBanner } from './components/Analytics'
import { ContentProvider } from './store/content'
import { AuthProvider } from './store/auth'
import { AdminLayout, AdminLoginPage, ProtectedAdminRoute } from './admin/AdminLayout'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const StudyAbroadPage = lazy(() => import('./pages/StudyAbroadPage').then((module) => ({ default: module.StudyAbroadPage })))
const StudyDestinationsPage = lazy(() => import('./pages/StudyDestinationsPage').then((module) => ({ default: module.StudyDestinationsPage })))
const DestinationDetailPage = lazy(() => import('./pages/DestinationDetailPage').then((module) => ({ default: module.DestinationDetailPage })))
const VisaServicesPage = lazy(() => import('./pages/VisaServicesPage').then((module) => ({ default: module.VisaServicesPage })))
const VisaDetailPage = lazy(() => import('./pages/VisaDetailPage').then((module) => ({ default: module.VisaDetailPage })))
const TravelServicesPage = lazy(() => import('./pages/TravelServicesPage').then((module) => ({ default: module.TravelServicesPage })))
const FlightBookingPage = lazy(() => import('./pages/FlightBookingPage').then((module) => ({ default: module.FlightBookingPage })))
const ToursHolidaysPage = lazy(() => import('./pages/ToursHolidaysPage').then((module) => ({ default: module.ToursHolidaysPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })))
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage').then((module) => ({ default: module.SuccessStoriesPage })))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((module) => ({ default: module.ResourcesPage })))
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((module) => ({ default: module.ArticlePage })))
const FaqsPage = lazy(() => import('./pages/FaqsPage').then((module) => ({ default: module.FaqsPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })))
const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then((module) => ({ default: module.GetStartedPage })))
const PrivacyPage = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.PrivacyPage })))
const TermsPage = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.TermsPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const AdminDashboardPage = lazy(() => import('./admin/DashboardPage').then((module) => ({ default: module.AdminDashboardPage })))
const AdminEnquiriesPage = lazy(() => import('./admin/EnquiriesPage').then((module) => ({ default: module.AdminEnquiriesPage })))
const AdminContentPage = lazy(() => import('./admin/content/ContentPage').then((module) => ({ default: module.AdminContentPage })))

function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
    </div>
  )
}

function RedirectTo({ to }: { to: string }) {
  const location = useLocation()
  return <Navigate to={`${to}${location.search}`} replace />
}

function LegacyDestinationRedirect() {
  const params = useParams()
  const suffix = params['*'] ? `/${params['*']}` : ''
  return <RedirectTo to={`/study-abroad/destinations${suffix}`} />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ContentProvider>
          <AuthProvider>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/study-abroad" element={<StudyAbroadPage />} />
                <Route path="/study-abroad/destinations" element={<StudyDestinationsPage />} />
                <Route path="/study-abroad/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/study-abroad/uk" element={<RedirectTo to="/study-abroad/destinations/uk" />} />
                <Route path="/study-abroad/germany" element={<RedirectTo to="/study-abroad/destinations/germany" />} />
                <Route path="/study-abroad/canada" element={<RedirectTo to="/study-abroad/destinations/canada" />} />
                <Route path="/study-destinations/*" element={<LegacyDestinationRedirect />} />
                <Route path="/visa-services" element={<VisaServicesPage />} />
                <Route path="/visa-services/:slug" element={<VisaDetailPage />} />
                <Route path="/visa-services/uk-visit-visa" element={<RedirectTo to="/visa-services/visitor-visa" />} />
                <Route path="/travel-services" element={<TravelServicesPage />} />
                <Route path="/flight-booking" element={<FlightBookingPage />} />
                <Route path="/tours-holidays" element={<ToursHolidaysPage />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route path="/about" element={<RedirectTo to="/about-us" />} />
                <Route path="/success-stories" element={<SuccessStoriesPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/:slug" element={<ArticlePage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/get-started" element={<GetStartedPage />} />
                <Route path="/privacy-policy" element={<PrivacyPage />} />
                <Route path="/privacy" element={<RedirectTo to="/privacy-policy" />} />
                <Route path="/terms-and-conditions" element={<TermsPage />} />
                <Route path="/terms" element={<RedirectTo to="/terms-and-conditions" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="/admin" element={<AdminLoginPage />} />
              <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
                  <Route path="/admin/content" element={<AdminContentPage />} />
                </Route>
              </Route>
            </Routes>
            </Suspense>
            <Analytics />
            <ConsentBanner />
          </AuthProvider>
        </ContentProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
