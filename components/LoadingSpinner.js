import styled from 'styled-components'

const LoaderContainer = styled.div`
  display: inline-block;
  height: 50px;
  width: 50px;
  margin: 20px;
  position: relative;

  .spinner {
    animation: rotate 2s linear infinite;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
    
    & .path {
      stroke: #ddd;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`

const LoadingSpinner = ({children, style}) => {
  return (
    <LoaderContainer style={style}>
      <svg className="spinner" viewBox="0 0 50 50">
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%"></linearGradient>
        <circle className="path" cx="25" cy="25" r="20" fill="url(#linear)" strokeWidth="5"></circle>
      </svg>
      {children}
    </LoaderContainer>
  )
}

export default LoadingSpinner
