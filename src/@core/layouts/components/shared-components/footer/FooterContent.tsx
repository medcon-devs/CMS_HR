// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FooterContent = () => {

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made `}
        
        {` by `}
        <Link target='_blank' href='https://medcon-me.com/'>
          Medcon
        </Link>
      </Typography>
    
    </Box>
  )
}

export default FooterContent
