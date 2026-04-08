import React from 'react'
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

const CustomersFilters = ({ searchQuery, setSearchQuery }) => {
  return (
    <Card sx={{ p: 2, boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
      <OutlinedInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        placeholder="Search for exact matches (name, surname, email, role, status...)"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        endAdornment={
          searchQuery && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setSearchQuery('')}
                edge="end"
                size="small"
              >
                <XIcon fontSize="var(--icon-fontSize-md)" />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </Card>
  )
}

export default CustomersFilters