import { lazy, Suspense } from 'react'

import { AnimatePresence } from 'framer-motion'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/common/ErrorBoundary'
import TopProgressBar from 'components/common/TopProgressBar'

import * as CONSTANT from 'common/constant'

const MinimalLayout = lazy(() => import('./layouts/Minimal'))
const AdminMainLayout = lazy(() => import('layouts/AdminMain'))
const ClientMainLayout = lazy(() => import('layouts/ClientMain'))

const AdminLoginView = lazy(() => import('./views/Admin/Login'))
const AdminLoginDemo = lazy(() => import('./views/Admin/Login/demo')) // new route for demo user
const AdminSettingsView = lazy(() => import('./views/Admin/Settings'))
const AdminMembersView = lazy(() => import('./views/Admin/Members'))
const AdminAudiencesView = lazy(() => import('./views/Admin/Audiences'))
const AdminAudienceSearchView = lazy(() => import('./views/Admin/AudienceSearch'))

const ClientLoginView = lazy(() => import('./views/Client/Login'))
const ClientRegisterView = lazy(() => import('./views/Client/Register'))
const ClientMembershipView = lazy(() => import('./views/Client/Membership'))
const ClientProfileUpdateView = lazy(() => import('./views/Client/ProfileUpdate'))

const LineAccessView = lazy(() => import('./views/LineAccess'))
const LineFriendView = lazy(() => import('./views/LineFriend'))
const PermissionErrorView = lazy(() => import('./views/PermissionError'))
const NotFoundView = lazy(() => import('./views/NotFound'))

const Router = () => {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <Suspense fallback={<TopProgressBar />}>
        <AnimatePresence mode='wait'>
          <Routes key={location.pathname} location={location}>
            <Route path='/' element={<Navigate replace to={CONSTANT.ADMIN_LOGIN_ROUTE} />} />
            <Route
              path={CONSTANT.ADMIN_LOGIN_ROUTE}
              element={
                <MinimalLayout>
                  <AdminLoginView />
                </MinimalLayout>
              }
            />

            <Route // new route for demo user
              path={CONSTANT.ADMIN_LOGIN_DEMO}
              element={
                <MinimalLayout>
                  <AdminLoginDemo />
                </MinimalLayout>
              }
            />
            <Route
              path={CONSTANT.ADMIN_AUDIENCES_ROUTE}
              element={
                <AdminMainLayout>
                  <AdminAudiencesView />
                </AdminMainLayout>
              }
            />
            <Route
              path={CONSTANT.ADMIN_AUDIENCES_SEARCH_ROUTE}
              element={
                <AdminMainLayout>
                  <AdminAudienceSearchView />
                </AdminMainLayout>
              }
            />

            <Route
              path={CONSTANT.ADMIN_MEMBERS_ROUTE}
              element={
                <AdminMainLayout>
                  <AdminMembersView />
                </AdminMainLayout>
              }
            />
            <Route
              path={CONSTANT.ADMIN_SETTINGS_ROUTE}
              element={
                <AdminMainLayout>
                  <AdminSettingsView />
                </AdminMainLayout>
              }
            />
            <Route
              path={`${CONSTANT.CLIENT_LOGIN_ROUTE}/:liffId`}
              element={
                <MinimalLayout>
                  <ClientLoginView />
                </MinimalLayout>
              }
            />

            <Route
              path={`${CONSTANT.CLIENT_REGISTER_ROUTE}/:liffId`}
              element={
                <MinimalLayout>
                  <ClientRegisterView />
                </MinimalLayout>
              }
            />
            <Route
              path={`${CONSTANT.CLIENT_MEMBERSHIP_ROUTE}/:liffId`}
              element={
                <ClientMainLayout>
                  <ClientMembershipView />
                </ClientMainLayout>
              }
            />
            <Route
              path={`${CONSTANT.CLIENT_PROFILE_UPDATE_ROUTE}/:liffId`}
              element={
                <ClientMainLayout>
                  <ClientProfileUpdateView />
                </ClientMainLayout>
              }
            />

            <Route
              path={CONSTANT.LINE_ACCESS_ROUTE}
              element={
                <MinimalLayout>
                  <LineAccessView />
                </MinimalLayout>
              }
            />

            <Route
              path={CONSTANT.LINE_FRIEND_ROUTE}
              element={
                <MinimalLayout>
                  <LineFriendView />
                </MinimalLayout>
              }
            />
            <Route
              path={CONSTANT.PERMISSION_ERROR_ROUTE}
              element={
                <MinimalLayout>
                  <PermissionErrorView />
                </MinimalLayout>
              }
            />
            <Route
              path={CONSTANT.NOT_FOUND_ROUTE}
              element={
                <MinimalLayout>
                  <NotFoundView />
                </MinimalLayout>
              }
            />
            <Route path='*' element={<Navigate replace to={CONSTANT.NOT_FOUND_ROUTE} />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  )
}

export default Router
