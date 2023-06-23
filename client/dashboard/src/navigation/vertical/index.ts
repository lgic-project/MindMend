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
      icon: AddReactionIcon,
      path: '/mood/mood-category',
      openInNewTab: true    },
      {
        title: 'Mood',
        icon: MoodIcon,
        path: '/mood/mood',
        openInNewTab: true    },

        {
          sectionTitle: 'Doctor'
        },
        {
          title: 'Doctor',
          icon: MedicationIcon,
          path: '/doctor/doctor'
        },
        {
          title: 'Doctor category',
          icon: MedicalServicesIcon,
          path: '/doctor/doctor-category'
        },

    {
      sectionTitle: 'Additional'
    },
    {
      title: 'Discover',
      icon: NewspaperIcon,
      path: '/additional/discover'
    },{
      title: 'SiteConfig',
      icon: SettingsIcon,
      path: '/additional/site-config',
      openInNewTab: true
    },
    {
      title: 'Excerisce Level',
      icon: FitnessCenterIcon,
      path: '/additional/exercise-level',
      openInNewTab: true
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'User',
      icon: PersonIcon,
      path: '/user'
    },
    {
      title: 'Group',
      icon: GroupWorkIcon,
      path: '/group'
    },
    {
      sectionTitle: 'Messenger'
    },
    {
      title: 'Chat',
      icon: NewspaperIcon,
      path: '/chat'
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
