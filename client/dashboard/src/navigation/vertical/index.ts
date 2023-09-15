// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import MedicationIcon from '@mui/icons-material/Medication';import MoodIcon from '@mui/icons-material/Mood';import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import AddReactionIcon from '@mui/icons-material/AddReaction';
// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

const navigation = (userInfo): VerticalNavItemsType => {
  const isAdmin = userInfo?. roleName === 'admin';
  const isUser = userInfo?.roleName === 'user';
console.log(userInfo)


  return [

    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },

    isAdmin && { sectionTitle: 'Admin' } ,

   {
      sectionTitle: 'Mood'
    },
    isAdmin &&{
      title: 'Mood category',
      icon: AddReactionIcon,
      path: '/mood/mood-category',
      openInNewTab: true    },
      isAdmin && {
        title: 'Mood',
        icon: MoodIcon,
        path: '/mood/mood',
        openInNewTab: true    },

        isAdmin &&{
          sectionTitle: 'Doctor'
        },
        isAdmin &&{
          title: 'Doctor',
          icon: MedicationIcon,
          path: '/doctor/doctor'
        },
        isAdmin &&{
          title: 'Doctor category',
          icon: MedicalServicesIcon,
          path: '/doctor/doctor-category'
        },

        isAdmin && {
      sectionTitle: 'Additional'
    },
    isAdmin && {
      title: 'Discover',
      icon: NewspaperIcon,
      path: '/additional/discover'
    },
    isAdmin &&{
      title: 'SiteConfig',
      icon: SettingsIcon,
      path: '/additional/site-config',
      openInNewTab: true
    },
    isAdmin && {
      title: 'Excerisce Level',
      icon: FitnessCenterIcon,
      path: '/additional/exercise-level',
      openInNewTab: true
    },

    isUser || isAdmin &&{
      title: 'User',
      icon: PersonIcon,
      path: '/user'
    },
    isAdmin && {
      title: 'Workout',
      icon: FitnessCenterIcon,
      path: '/workout/workout',
      openInNewTab: true
    },
    isAdmin && {
      title: 'Role Permission',
      icon: MoodIcon,
      path: '/role-permission',
      openInNewTab: true    },
    isUser || isAdmin && {
      sectionTitle: 'User Interface'
    },
    isUser || isAdmin &&{
      title: 'Profile',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    isUser || isAdmin && {
      title: 'Group',
      icon: GroupWorkIcon,
      path: '/group'
    },
    isUser || isAdmin &&{
      title: 'Workout',
      icon: GroupWorkIcon,
      path: '/workout'
    },
    isUser || isAdmin &&{
      title: 'Doctor',
      icon: GroupWorkIcon,
      path: '/doctor'
    },
    // isUser || isAdmin && {
    //   title: 'Chat',
    //   icon: NewspaperIcon,
    //   path: '/chat'
    // },

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
