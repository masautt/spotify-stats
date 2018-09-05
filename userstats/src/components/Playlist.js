import React from "react";

class Playlist extends React {
    render() {
      return (
        <div style={{...defaultStyle, ...hStyle, ...playListStyle, /*'background-color': isEven(this.props.index) ? '#116466' : '#EB6E18' */}}>
          <img src={track[i].img} style={albumStyle} />
          <h2 style={{
            'text-align': 'center',
            'font-size': '10px'
          }}>{track[i].name}</h2>
          {/* <ul style={{ 'margin-top': '10px', 'font-size': '5px' }}>
            {playlist.songs.map(song =>
              <li style={{ 'padding-top': '2px' }}>{song.name}</li>
            )}
          </ul> */}
        </div>
      );
    }
  }


  let defaultStyle = {
    color: '#fff',
    'font-family': 'Sawarabi Gothic, sans-serif'
  };
  let counterStyle = {
    ...defaultStyle,
    width: "50%",
    display: 'inline-block',
    'margin-top': '40px',
    'margin-bottom': '20px',
    'font-size': '20px',
    'line-height': '30px',
    'text-align': 'center'
  }
  let hStyle = {
    ...defaultStyle,
    'text-align': 'center',
    'margin-top': '5px'
  }
  let imgStyle = {
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'width': '50%',
    'margin-top': '20px',
    'border-radius': '20px'
  }
  let divStyle = {
    'background': '#242B2E',
    'margin-top': '20px',
    'border-radius': '20px',
    'display': 'inline-block',
    'margin': '20px'
  }
  let smallDivStyle = {
    float: 'left',
    width: '300px',
    height: '400px',
  }
  let largeDivStyle = {
    'width': '850px',
    'height': '850px',
  }
  let albumStyle = {
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'width': '100px',
    'height': '100px'
  }
  let playListListStyle = {
    'margin': 'auto',
    'height': '100%',
    'width': '95%',
    'height': '800px',
    'overflow': 'hidden',
    'overflow-y': 'scroll',
    'border-radius': '20px',
  }
  let playListStyle = {
    'display': 'inline-block', 
    'width': '130px', 
    'height': '130px', 
    'border-color': 'white', 
    'border-weight': '10px', 
    'border-style': 'solid',
    'padding': '5px', 
    'overflow-y': 'hidden', 
    'background-color': '#116466', 
    'border-radius': '5px', 
    'margin': '5px', 
    
  }

  export default Playlist;