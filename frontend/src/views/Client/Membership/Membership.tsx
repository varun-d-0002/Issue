import { Image, Tag } from 'antd'
import * as COMMONS from 'common/constant'
import BaseAnimation from 'components/common/BaseAnimation'
import TapAnimation from 'components/common/TapAnimation'
import ClientTopBarComponent from 'components/client/TopBar'
import { m } from 'framer-motion'
import Barcode from 'react-barcode'
import { Link, useParams } from 'react-router-dom'

const PencilSvg = ({ className }: any) => (
  <svg
    x='0px'
    y='0px'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    className={className}
    fill='currentColor'
  >
    <path d='M19.769 9.923l-12.642 12.639-7.127 1.438 1.438-7.128 12.641-12.64 5.69 5.691zm1.414-1.414l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z' />
  </svg>
)

const Membership = (props: { publicSettings?: any; personalInfo?: any }) => {
  const { publicSettings, personalInfo } = props
  const { liffId } = useParams()

  return (
    <>
      <BaseAnimation>
        <m.div
          variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
          initial='hidden'
          animate='show'
          exit='hidden'
          className='my-8'
        >
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
            <ClientTopBarComponent logo={undefined} {...props} />
            <p
              className='text-center text-2xl font-bold w-full border border-t-0 border-l-0 border-r-0 border-dashed py-4 px-6 mt-8'
              style={{ color: publicSettings?.PRIMARY_COLOR }}
            >
              会員証
              <br />
              MEMBER'S CARD
            </p>
          </m.div>
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='my-8 px-4'>
            <div
              className='rounded-lg border border-solid shadow p-4'
              style={{
                backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR,
                borderColor: publicSettings?.PRIMARY_COLOR,
                color: publicSettings?.PRIMARY_COLOR,
              }}
            >
              <div className='flex justify-center mb-2'>
                {personalInfo?.picUrl ? (
                  <Image
                    preview={false}
                    className='rounded-full w-20 h-20'
                    style={{
                      border: `2px solid ${publicSettings?.PRIMARY_COLOR}`,
                    }}
                    src={`${personalInfo.picUrl}`}
                    fallback='/no-image.png'
                  />
                ) : (
                  <Image
                    preview={false}
                    className='rounded-full w-20 h-20'
                    style={{
                      border: `2px solid ${publicSettings?.PRIMARY_COLOR}`,
                    }}
                    src='/no-image.png'
                  />
                )}
              </div>
              <p className='text-center text-2xl text-black font-bold'>
                {`${personalInfo?.lastName || ''} ${personalInfo?.firstName || ''} 様`}
              </p>
              <p className='text-center text-sm font-bold mb-4'>
                （{`${personalInfo?.lastNameKana || ''} ${personalInfo?.firstNameKana || ''}`}）
              </p>
              <div className='flex justify-center'>
                <div className='flex flex-col text-black'>
                  <div className='flex'>
                    <div className='flex-none w-32'>
                      <p className='text-sm font-bold text-right'>電話番号：</p>
                    </div>
                    <div className='flex-1 ml-2'>
                      <p className='text-sm'>{personalInfo?.telephone || 'ー'}</p>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-none w-32'>
                      <p className='text-sm font-bold text-right'>生年月日：</p>
                    </div>
                    <div className='flex-1 ml-2'>
                      <p className='text-sm'>{personalInfo?.dateOfBirth || 'ー'}</p>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-none w-32'>
                      <p className='text-sm font-bold text-right'>住所：</p>
                    </div>
                    <div className='flex-1 ml-2'>
                      <p className='text-sm'>{personalInfo?.address || 'ー'}</p>
                    </div>
                  </div>

                  <div className='flex'>
                    <div className='flex-none w-32'>
                      <p className='text-sm font-bold text-right'>物件希望エリア:</p>
                    </div>
                    <div className='flex-1 ml-2'>
                      {personalInfo?.preferenceAreas.map((preferenceAreas: any) => (
                        <Tag color='processing'>
                          <span key={preferenceAreas.id}>{preferenceAreas}</span>
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='flex-none w-32'>
                      <p className='text-sm font-bold text-right'>ご希望種別:</p>
                    </div>
                    <div className='flex-1 ml-2'>
                      {personalInfo?.preferenceTypes.map((preferenceTypes: any, index: any) => (
                        <Tag color='success'>
                          <span key={preferenceTypes.id}>
                            {COMMONS.PREFERENCETYPES?.find(
                              (pr) => pr?.value + '' === preferenceTypes,
                            )?.label || preferenceTypes}
                          </span>
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='rounded-lg border border-solid shadow mt-4'
              style={{
                borderColor: publicSettings?.PRIMARY_COLOR,
                color: publicSettings?.PRIMARY_COLOR,
              }}
            >
              <div className='flex flex-col p-4'>
                <div className='flex justify-center'>
                  <Barcode
                    value={personalInfo?.memberCode || '000000000000000'}
                    displayValue={false}
                    height={80}
                    width={2}
                    margin={0}
                  />
                </div>
                <p className='text-center text-sm text-black'>
                  ID: {personalInfo?.memberCode || '000000000000000'}
                </p>
              </div>
            </div>
          </m.div>
          <m.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='px-4'>
            <div className='flex justify-center'>
              <TapAnimation>
                <Link
                  to={`${COMMONS.CLIENT_PROFILE_UPDATE_ROUTE}/${liffId}`}
                  className='text-base text-black font-bold'
                >
                  <p className=' border-solid border-t-0 border-l-0 border-r-0 border-b'>
                    <span>
                      <PencilSvg className='mr-2 ' />
                    </span>
                    <span className='text-lg'>お客様情報を編集する</span>
                  </p>
                </Link>
              </TapAnimation>
            </div>
          </m.div>
        </m.div>
      </BaseAnimation>
    </>
  )
}

export default Membership
