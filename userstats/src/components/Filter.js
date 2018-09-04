import React from "react";
let searchBtnStyle = {
  'width' : '30%',
  'height' : '45px',
  'fontFamily': 'Sawarabi Gothic, sans-serif',
  'borderTopRightRadius' : '10px',
  'borderBottomRightRadius' : '10px',
  'background' : '#116466',
  'borderColor' : '#116466',
  'borderWidth' : '5px',
  'textAlign' : 'center',
  'color' : 'white'
}

const Filter = props=> (
      <form  onSubmit={props.getData} style={{
        'width' : '70%',
        'margin' : 'auto'
        }}>
        <input type="text" name="searchTerm" placeholder="Search for a playlist..."style={{
          width: '60%',
          padding: '5px',
          height: '30px'
        }}></input>
        <button style={searchBtnStyle}>Search</button>
      </form>
  )

  export default Filter;