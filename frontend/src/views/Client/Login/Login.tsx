import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import liff from '@line/liff'
import * as COMMONS from 'common/constant'
import * as API from 'common/api'
import * as UTILITY from 'common/utility'

const Login = (props: any) => {
  const { liffId } = useParams()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isMountedRef = UTILITY.USE_IS_MOUNTED_REF()

  const [accessToken, setAccessToken] = useState(undefined)

  useQuery(
    [API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken],
    () => API.CLIENT_GET_PERSONAL_INFO(accessToken),
    {
      enabled: !!accessToken,
      onSuccess: (response) => {
        if (isMountedRef.current) {
          if (response?.data?.memberCode) {
            navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
          } else {
            navigate(`${COMMONS.CLIENT_REGISTER_ROUTE}/${liffId}`)
          }
        }
      },
      onError: (error: FetchError) => {
        if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
          message.error({
            content: COMMONS.ERROR_SYSTEM_MSG,
            key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
          })
        } else {
          message.error({
            content: COMMONS.ERROR_SYSTEM_MSG,
            key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
          })
        }
      },
    },
  )

  const handleLineLogin = () => {
    liff
      .getFriendship()
      .then((data) => {
        if (data.friendFlag) {
          //@ts-ignore
          setAccessToken(liff.getAccessToken())
        } else {
          navigate(COMMONS.LINE_FRIEND_ROUTE)
        }
      })
      .catch((e) => {
        console.log({
          msg: 'catch error',
          init: liff.init,
          liffId: liffId,
          error: e,
        })
        navigate(COMMONS.LINE_FRIEND_ROUTE)
      })
  }
  useEffect(() => {
    setTimeout(() => {
      liff
        .init({
          //@ts-ignore
          liffId: liffId,
        })
        .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login()
          }

          if (import.meta.env.VITE_APP_ENV === 'PRODUCTION') {
            if (liff.isInClient()) {
              handleLineLogin()
            } else {
              navigate(COMMONS.LINE_ACCESS_ROUTE)
            }
          } else {
            handleLineLogin()
          }
        })
        .catch((err) => {
          console.log({
            msg: 'catch err',
            init: liff.init,
            liffId: liffId,
            error: err,
          })
          console.log(err)
          message.error({
            content: COMMONS.ERROR_SYSTEM_MSG,
            key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
          })
        })
    }, 500)

    // eslint-disable-next-line
  }, [])

  return <></>
}

export default Login
