import React, { useState, Component, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import api from '../api';
import axios from 'axios';

const AdminUserManagementPage = () => {
  const TabContainer = styled.div`
    padding-top: 75px;
    padding-right: 240px;
    padding-left: 240px;
  `;
  const SearchBarContainer = styled.div`
    padding-top: 10px;
    padding-right: 240px;
    padding-left: 240px;
    padding-bottom: 10px;
  `;

  const DataTableContainer = styled.div`
    padding-top: 10px;
    padding-right: 100px;
    padding-left: 240px;
  `;

  const onSearch = (query) => {
    setQuery(query);
  };

  const [rows, setRows] = useState([]);

  /**
 TASK 5
 */

  const { isLoading, error, data } = useQuery('users', () =>
    api.get('/api/users').then((res) => {
      console.log(res);
      console.log(res.data);
      setRows(
        res.data.map((user) => ({
          id: user._id,
          type: user.type,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
        }))
      );
      return res.data;
    })
  );

  async function handleDelete(params) {
    try {
      const datagrid_api = params.api;
      const fields = datagrid_api
        .getAllColumns()
        .map((c) => c.field)
        .filter((c) => c !== '__check__' && !!c);
      const thisRow = {};

      fields.forEach((f) => {
        thisRow[f] = params.getValue(f);
      });

      await api.delete(`/api/users/delete/user?id=${thisRow['id']}`, data);
    } catch (error) {
      console.log(error);
      const { message, code } =
        error.response.status === 400
          ? error.response.data
          : { message: 'An unknown error occurred.', code: null };
    }
  }

  const columns = [
    { field: 'id', headerName: 'id', width: 20 },
    { field: 'type', headerName: 'User Type', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 300 },
    {
      field: '',
      headerName: 'Action',
      renderCell: (params) => (
        <Button
          color="default"
          size="medium"
          onClick={() => handleDelete(params)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="AdminUserManagement">
      <div>
        <TabContainer>
          <Link style={{ color: 'black' }} to="/adminUser">
            View Existing Users
          </Link>
          <div class="divider" />
          <Link to="/createUser">Create User</Link>
        </TabContainer>
        <SearchBarContainer>
          <SearchBar
            placeholder={'Search by name'}
            onSearch={onSearch}
          ></SearchBar>
        </SearchBarContainer>
      </div>
      <DataTableContainer>
        <div style={{ height: 450, width: '80%' }}>
          {isLoading ? (
            'Loading...'
          ) : error ? (
            <p style={{ color: 'red' }}>An error occurred! {error}</p>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              checkboxSelection
            />
          )}
        </div>
      </DataTableContainer>
    </div>
  );
};

export default AdminUserManagementPage;
