import React from 'react'
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

const CustomersFilters = ({ searchQuery, setSearchQuery, headerFilter, setHeaderFilter }) => {
  // Define the available headers for filtering
  const headerOptions = [
    { value: '', label: 'All Headers' },
    { value: 'name', label: 'First Name' },
    { value: 'surName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'currentRole', label: 'Current Role' },
    { value: 'expectedRole', label: 'Expected Role' },
    { value: 'status', label: 'Status' },
    { value: 'internalRAG', label: 'RAG' },
  ];

  return (
    <Card sx={{ p: 2, boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Header Filter Dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="header-filter-label">Filter by Header</InputLabel>
          <Select
            labelId="header-filter-label"
            value={headerFilter || ''}
            label="Filter by Header"
            onChange={(e) => setHeaderFilter(e.target.value)}
          >
            {headerOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Input */}
        <OutlinedInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder={headerFilter ? `Search in ${headerOptions.find(opt => opt.value === headerFilter)?.label}...` : "Search for exact matches (name, surname, email, role, status...)"}
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
      </Stack>
    </Card>
  )
}

export default CustomersFilters