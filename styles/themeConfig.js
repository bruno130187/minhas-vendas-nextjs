import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#FFF',
  background: '#363537',
  cardColor: '#4a4a4a',
  cardBackgroud: '#FFF',
  thStriped: '#fafafa',
}

export const darkTheme = {
  body: '#363537',
  text: '#FFF',
  toggleBorder: '#6B8096',
  background: '#999',
  cardColor: '#FFF',
  cardBackgroud: '#4F4F4F',
  thStriped: '#4F4F4F',
}

export const GlobalStyles = createGlobalStyle`
  html {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }
  body .section .card {
    background-color: ${({ theme }) => theme.cardBackgroud};
    color: ${({ theme }) => theme.cardColor};
  }
  .card-header-title {
    color: ${({ theme }) => theme.cardColor};
  }
  .label {
    color: ${({ theme }) => theme.cardColor};
  }
  .menu-label {
    color: ${({ theme }) => theme.cardColor};
  }
  .menu-list a {
    color: ${({ theme }) => theme.cardColor};
  }
  .table {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
  .table.is-striped tbody tr:not(.is-selected):nth-child(even) {
    background-color: ${({ theme }) => theme.thStriped};
  }
  .table thead tr th {
    color: ${({ theme }) => theme.text};
  }
  .sortable tr {
    background-color: coral;
  }
`