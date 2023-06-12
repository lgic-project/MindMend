// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Profile',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'Mood'
    },
    {
      title: 'Mood category',
      icon: FormatLetterCase,
      path: '/mood/mood-category',
      openInNewTab: true    },
      {
        title: 'Mood',
        icon: FormatLetterCase,
        path: '/mood/mood',
        openInNewTab: true    },

        {
          sectionTitle: 'Doctor'
        },
        {
          title: 'Doctor',
          icon: FormatLetterCase,
          path: '/doctor/doctor'
        },
        {
          title: 'Doctor category',
          icon: FormatLetterCase,
          path: '/doctor/doctor-category'
        },

    {
      sectionTitle: 'Additional'
    },
    {
      title: 'Discover',
      icon: FormatLetterCase,
      path: '/additional/discover'
    },{
      title: 'SiteConfig',
      icon: AlertCircleOutline,
      path: '/site-config',
      openInNewTab: true
    },
    {
      title: 'Excerisce Level',
      icon: AlertCircleOutline,
      path: '/exercise-level',
      openInNewTab: true
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'User',
      icon: FormatLetterCase,
      path: '/user'
    },
    {
      title: 'Group',
      icon: FormatLetterCase,
      path: '/group'
    },

    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
