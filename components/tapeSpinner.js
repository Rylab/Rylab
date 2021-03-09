import { useRef } from 'react'
import styled from 'styled-components'

const CassetteContainer = styled.div`
  border-radius: 2px;
  margin: 15px 0 3px 0;
  width: 248px;
  height: 159px;
  position: relative;

  .background {
    border-radius: 2px;
    top: 0;
    left: 0;
    position: absolute;
    width: 248px;
    height: 159px;
  }
  .artistInput, .titleInput {
    margin: 0;
    left: 24px;
    position: absolute;
    width: 200px;
  }
  .artistInput {
    bottom: 20px;
  }
  .titleInput {
    bottom: 43px;
  }

  .artistLine, .titleLine {
    font-size: 14px;
    left: 24px;
    overflow: hidden;
    position: absolute;
    text-align: center;
    white-space: nowrap;
    width: 202px;
  }
    .artistLine:hover, .titleLine:hover {
      cursor: default;
      user-select: none;
    }

  .artistLine {
    bottom: 25px;
  }
    .artistLine.long {
      font-size: 11px;
      bottom: 26px;
    }
  .titleLine {
    bottom: 46px;
  }
    .titleLine.long {
      font-size: 11px;
      bottom: 47px;
    }

  .notesInput {
    width: 400px;
  }

  @media(min-width: 568px) {
    border-radius: 4px;
    width: 400px;
    height: 257px;

    .background {
      border-radius: 4px;
      width: 400px;
      height: 257px;
    }
  
    .artistInput, .titleInput {
      font-size: 18px;
      left: 44px;
      width: 314px;
    }
    .artistInput {
      bottom: 38px;
    }
    .titleInput {
      bottom: 71px;
    }

    .artistLine, .titleLine {
      font-size: 19px;
      left: 38px;
      width: 326px;
    }
    .artistLine {
      bottom: 41px;
      font-style: italic;
    }
      .artistLine.long {
        bottom: 41px;
        font-size: 17px;
      }
    .titleLine {
      bottom: 76px;
      font-weight: 600;
    }
      .titleLine.long {
        bottom: 76px;
        font-size: 17px;
      }

    .notesInput {
      width: 400px;
    }
  }
`

const TapeSpinner = ({children, spin = true, style}) => {
  const leftWheel = useRef(null)
  const rightWheel = useRef(null)

  const spinWheels = () => {
    window.requestAnimationFrame(r1);
    window.requestAnimationFrame(r2);
  }

  const r1 = (t) => {
    const m = t % 1500;
    const d = m * 0.24;
    leftWheel.current.setAttribute('transform-origin', '44px 45px');
    leftWheel.current.setAttribute('transform', 'rotate('+d+')');
    window.requestAnimationFrame(r1);
  }

  const r2 = (t) => {
    const m = t % 1500;
    const d = m * 0.24;
    rightWheel.current.setAttribute('transform-origin', '44px 45px');
    rightWheel.current.setAttribute('transform', 'translate(292.390000, 0.000000),rotate('+d+')');
    window.requestAnimationFrame(r2);
  }

  return (
    <CassetteContainer style={style}>
      <svg onLoad={spin ? spinWheels() : ()=>{}} className="background" width="697px" height="447px" viewBox="0 0 697 447" version="1.1">
        <g id="cassette-border" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="tapecassette" transform="translate(1.000000, 1.000000)">
            <g id="main-body" transform="translate(347.154060, 222.240550) scale(-1, 1) rotate(-180.000000) translate(-347.154060, -222.240550) translate(0.154060, 0.740550)">
              <rect id="inner-body" stroke="#000000" strokeWidth="4.115" fillOpacity="0.6" fill="#D8D8D8" strokeLinecap="round" x="41.094" y="37.232" width="610.86" height="296"></rect>
              <path d="M162.938464,196.74055 C150.695282,196.74055 140.84594,206.745384 140.84594,219.182306 L140.84594,297.298794 C140.84594,309.735513 150.695082,319.74055 162.938464,319.74055 L537.753416,319.74055 C549.996598,319.74055 559.84594,309.735716 559.84594,297.298794 L559.84594,219.182306 C559.84594,206.745587 549.996798,196.74055 537.753416,196.74055 L162.938464,196.74055 L162.938464,196.74055 Z M277.830106,216.74055 L424.893135,216.74055 C429.310636,216.74055 432.84594,220.359979 432.84594,224.84306 L432.84594,297.669866 C432.84594,302.152845 429.310736,305.74055 424.893135,305.74055 L277.830106,305.74055 C273.412604,305.74055 269.84594,302.152946 269.84594,297.669866 L269.84594,224.84306 C269.84594,220.36008 273.412504,216.74055 277.830106,216.74055 L277.830106,216.74055 Z" id="wheel-cover" fill="#000000" fillRule="nonzero"></path>
              <rect id="outer-body" stroke="#000000" strokeWidth="3.7838" strokeLinecap="round" x="0.7378" y="0.0514" width="692.68" height="442.8"></rect>
              <g id="wheels" transform="translate(161.000000, 213.000000)" stroke="#FFFFFF">
                <g ref={leftWheel}>
                  <path d="M88.6088629,45.1415212 C88.6088629,69.6036554 68.7784728,89.434857 44.3155271,89.434857 C19.8533929,89.434857 0.02219122,69.604467 0.02219122,45.1415212 C0.02219122,20.679387 19.8525813,0.84818536 44.3155271,0.84818536 C68.7776612,0.84818536 88.6088629,20.6785754 88.6088629,45.1415212 Z" id="border" strokeWidth="10.2836569" strokeLinecap="round"></path>
                  <g id="teeth" transform="translate(2.000000, 11.000000)" fill="#FFFFFF" fillRule="nonzero">
                    <rect id="rect3609" x="0.65" y="31.61" width="12.738" height="7.8723"></rect>
                    <rect id="rect3611" x="70.07" y="31.61" width="12.738" height="7.8723"></rect>
                    <rect id="rect3613" transform="translate(18.752100, 9.537218) rotate(48.548000) translate(-18.752100, -9.537218) " x="12.3830999" y="5.60106805" width="12.738" height="7.8723"></rect>
                    <rect id="rect3615" transform="translate(64.700990, 61.560747) rotate(48.548000) translate(-64.700990, -61.560747) " x="58.3319905" y="57.6245969" width="12.738" height="7.8723"></rect>
                    <rect id="rect3617" transform="translate(20.859479, 63.284804) rotate(-53.045000) translate(-20.859479, -63.284804) " x="14.4904794" y="59.348654" width="12.738" height="7.8723"></rect>
                    <rect id="rect3619" transform="translate(62.590495, 7.815287) rotate(-53.045000) translate(-62.590495, -7.815287) " x="56.2214952" y="3.87913658" width="12.738" height="7.8723"></rect>
                  </g>
                </g>
                <g ref={rightWheel} transform="translate(292.390000, 0.000000)">
                  <path d="M88.6088629,45.1415212 C88.6088629,69.6036554 68.7784728,89.434857 44.3155271,89.434857 C19.8533929,89.434857 0.02219122,69.604467 0.02219122,45.1415212 C0.02219122,20.679387 19.8525813,0.84818536 44.3155271,0.84818536 C68.7776612,0.84818536 88.6088629,20.6785754 88.6088629,45.1415212 Z" id="border" strokeWidth="10.2836569" strokeLinecap="round"></path>
                  <g id="teeth" transform="translate(2.000000, 11.000000)" fill="#FFFFFF" fillRule="nonzero">
                    <rect id="rect3647" x="0.65" y="31.61" width="12.738" height="7.8723"></rect>
                    <rect id="rect3649" x="70.07" y="31.61" width="12.738" height="7.8723"></rect>
                    <rect id="rect3651" transform="translate(18.752100, 9.537218) rotate(48.548000) translate(-18.752100, -9.537218) " x="12.3830999" y="5.60106805" width="12.738" height="7.8723"></rect>
                    <rect id="rect3653" transform="translate(64.700990, 61.560747) rotate(48.548000) translate(-64.700990, -61.560747) " x="58.3319905" y="57.6245969" width="12.738" height="7.8723"></rect>
                    <rect id="rect3655" transform="translate(20.859479, 63.284804) rotate(-53.045000) translate(-20.859479, -63.284804) " x="14.4904794" y="59.348654" width="12.738" height="7.8723"></rect>
                    <rect id="rect3657" transform="translate(62.590495, 7.815287) rotate(-53.045000) translate(-62.590495, -7.815287) " x="56.2214952" y="3.87913658" width="12.738" height="7.8723"></rect>
                  </g>
                </g>
              </g>
              <rect id="label" stroke="#000000" strokeWidth="4.115" fill="#FFFFFF" strokeLinecap="round" x="61.419" y="48.181" width="573.74" height="137"></rect>
              <line x1="79.25" y1="61.746" x2="618.25" y2="61.746" id="lower-text-line" stroke="#000000"></line>
              <line x1="79.25" y1="119.746" x2="618.25" y2="119.746" id="upper-text-line" stroke="#000000"></line>
              <g id="left-bush" opacity="0.731990371" transform="translate(49.000000, 373.000000)" stroke="#000000" strokeLinecap="round">
                <path d="M51.09,26.01 C51.09,39.925 39.81,51.205 25.895,51.205 C11.98,51.205 0.7,39.925 0.7,26.01 C0.7,12.095 11.98,0.815 25.895,0.815 C39.81,0.815 51.09,12.095 51.09,26.01 Z" id="path3698" strokeWidth="4.115" fillOpacity="0.2" fill="#D8D8D8"></path>
                <path d="M29.2605365,26.7355985 C29.2605365,28.1945863 28.0778285,29.3772943 26.6188408,29.3772943 C25.159853,29.3772943 23.977145,28.1945863 23.977145,26.7355985 C23.977145,25.2766108 25.159853,24.0939028 26.6188408,24.0939028 C28.0778285,24.0939028 29.2605365,25.2766108 29.2605365,26.7355985 Z" id="path3700" strokeWidth="2.4920748"></path>
              </g>
              <g id="right-bush" opacity="0.731990371" transform="translate(598.870000, 373.000000)" stroke="#000000" strokeLinecap="round">
                <path d="M51.09,26.01 C51.09,39.925 39.81,51.205 25.895,51.205 C11.98,51.205 0.7,39.925 0.7,26.01 C0.7,12.095 11.98,0.815 25.895,0.815 C39.81,0.815 51.09,12.095 51.09,26.01 Z" id="path3708" strokeWidth="4.115" fillOpacity="0.2" fill="#D8D8D8"></path>
                <path d="M29.2605365,26.7355985 C29.2605365,28.1945863 28.0778285,29.3772943 26.6188408,29.3772943 C25.159853,29.3772943 23.977145,28.1945863 23.977145,26.7355985 C23.977145,25.2766108 25.159853,24.0939028 26.6188408,24.0939028 C28.0778285,24.0939028 29.2605365,25.2766108 29.2605365,26.7355985 Z" id="path3710" strokeWidth="2.4920748"></path>
              </g>
              <path d="M138.561,357.455169 C145.3115,350.002388 551.571,353.422541 558.481,356.730252 C569.09,361.804803 587.654,442.996704 587.654,442.996704 L112.04,442.996704 C122.385333,394.069204 131.225667,365.555359 138.561,357.455169 Z" id="top-round-bulge" stroke="#000000" strokeWidth="3.4" fillOpacity="0.8" fill="#D8D8D8"></path>
              <path d="M201.33,418.69 C201.33,427.2343 194.4035,434.161 185.859,434.161 C177.3147,434.161 170.388,427.2345 170.388,418.69 C170.388,410.1458 177.3145,403.219 185.859,403.219 C194.4033,403.219 201.33,410.1455 201.33,418.69 Z" id="outerdot-2" stroke="#000000" strokeWidth="3.4" opacity="0.671602471" strokeLinecap="round"></path>
              <path d="M538.15,418.69 C538.15,427.2343 531.2235,434.161 522.679,434.161 C514.1347,434.161 507.208,427.2345 507.208,418.69 C507.208,410.1458 514.1345,403.219 522.679,403.219 C531.2233,403.219 538.15,410.1455 538.15,418.69 Z" id="outerdot-1" stroke="#000000" strokeWidth="3.4" opacity="0.671602471" strokeLinecap="round"></path>
              <path d="M463.01,406.313 C463.01,414.8573 456.0835,421.784 447.539,421.784 C438.9947,421.784 432.068,414.8575 432.068,406.313 C432.068,397.7688 438.9945,390.842 447.539,390.842 C456.0833,390.842 463.01,397.7685 463.01,406.313 Z" id="innerdot-2" stroke="#000000" strokeWidth="3.4" opacity="0.671602471" strokeLinecap="round"></path>
              <path d="M269.401,405.429 C269.401,413.9733 262.4745,420.9 253.93,420.9 C245.3857,420.9 238.459,413.9735 238.459,405.429 C238.459,396.8848 245.3855,389.958 253.93,389.958 C262.4743,389.958 269.401,396.8845 269.401,405.429 Z" id="innerdot-1" stroke="#000000" strokeWidth="3.4" opacity="0.671602471" strokeLinecap="round"></path>
              <g id="tape-roll" opacity="0.398392078" transform="translate(262.000000, 210.000000)" stroke="#000000" strokeLinecap="round" strokeWidth="6.3077">
                <path d="M173.57,103.57 C144.997,103.57 121.816,80.411 121.816,51.838 C121.816,23.265 144.997,0.105733333 173.57,0.105733333 C173.67325,0.105733333 173.77352,0.105733333 173.87662,0.105733333 L173.87662,103.566 C173.77352,103.5666 173.67325,103.566 173.57,103.566 L173.57,103.57 Z" id="path3783"></path>
                <path d="M1.01,103.57 C29.583,103.57 52.764,80.411 52.764,51.838 C52.764,23.265 29.583,0.105733333 1.01,0.105733333 C0.90675,0.105733333 0.80648,0.105733333 0.70338,0.105733333 L0.70338,103.566 C0.80648,103.5666 0.90675,103.566 1.01,103.566 L1.01,103.57 Z" id="path3788"></path>
              </g>
              <g id="screw-bl" opacity="0.354106105" transform="translate(9.845940, 10.740550)">
                <path d="M22.4930439,11.3132127 C22.4930439,17.4380233 17.5279209,22.4032896 11.402967,22.4032896 C5.2781564,22.4032896 0.31289004,17.4381666 0.31289004,11.3132127 C0.31289004,5.18847381 5.27801303,0.22313577 11.402967,0.22313577 C17.5277775,0.22313577 22.4930439,5.18825876 22.4930439,11.3132127 Z" id="path3722" stroke="#000000" strokeWidth="3.13699145" strokeLinecap="round"></path>
                <polygon id="path3794" fill="#000000" fillRule="nonzero" points="4.647 13.491 9.7355 13.60162 9.7355 18.57952 12.9435 18.4689 12.72226 13.491 17.70016 13.26976 17.58954 10.61486 12.61164 10.72548 12.3904 4.75198 9.6249 4.97322 9.84614 10.83612 4.64704 10.83612 4.64704 13.49102"></polygon>
              </g>
              <g id="screw-br" opacity="0.354106105" transform="translate(659.845940, 10.740550)">
                <path d="M22.5430439,11.3132127 C22.5430439,17.4380233 17.5779209,22.4032896 11.452967,22.4032896 C5.3281564,22.4032896 0.36289004,17.4381666 0.36289004,11.3132127 C0.36289004,5.18847381 5.32801303,0.22313577 11.452967,0.22313577 C17.5777775,0.22313577 22.5430439,5.18825876 22.5430439,11.3132127 Z" id="path3724" stroke="#000000" strokeWidth="3.13699145" strokeLinecap="round"></path>
                <polygon id="path3794-1" fill="#000000" fillRule="nonzero" points="5.07 13.451 10.1585 13.56162 10.1585 18.53952 13.3665 18.4289 13.14526 13.451 18.12316 13.22976 18.01254 10.57486 13.03464 10.68548 12.8134 4.71198 10.0479 4.93322 10.26914 10.79612 5.07004 10.79612 5.07004 13.45102"></polygon>
              </g>
              <g id="screw-ul" opacity="0.354106105" transform="translate(9.845940, 410.740550)">
                <path d="M22.5430439,11.3132127 C22.5430439,17.4380233 17.5779209,22.4032896 11.452967,22.4032896 C5.3281564,22.4032896 0.36289004,17.4381666 0.36289004,11.3132127 C0.36289004,5.18847381 5.32801303,0.22313577 11.452967,0.22313577 C17.5777775,0.22313577 22.5430439,5.18825876 22.5430439,11.3132127 Z" id="path3724-4" stroke="#000000" strokeWidth="3.13699145" strokeLinecap="round"></path>
                <polygon id="path3794-1-0" fill="#000000" fillRule="nonzero" points="5.07 13.451 10.1585 13.56162 10.1585 18.53952 13.3665 18.4289 13.14526 13.451 18.12316 13.22976 18.01254 10.57486 13.03464 10.68548 12.8134 4.71198 10.0479 4.93322 10.26914 10.79612 5.07004 10.79612 5.07004 13.45102"></polygon>
              </g>
              <g id="screw-ur" opacity="0.354106105" transform="translate(659.845940, 410.740550)">
                <path d="M22.5430439,11.3132127 C22.5430439,17.4380233 17.5779209,22.4032896 11.452967,22.4032896 C5.3281564,22.4032896 0.36289004,17.4381666 0.36289004,11.3132127 C0.36289004,5.18847381 5.32801303,0.22313577 11.452967,0.22313577 C17.5777775,0.22313577 22.5430439,5.18825876 22.5430439,11.3132127 Z" id="path3724-4-4" stroke="#000000" strokeWidth="3.13699145" strokeLinecap="round"></path>
                <polygon id="path3794-1-0-8" fill="#000000" fillRule="nonzero" points="5.07 13.451 10.1585 13.56162 10.1585 18.53952 13.3665 18.4289 13.14526 13.451 18.12316 13.22976 18.01254 10.57486 13.03464 10.68548 12.8134 4.71198 10.0479 4.93322 10.26914 10.79612 5.07004 10.79612 5.07004 13.45102"></polygon>
              </g>
            </g>
          </g>
        </g>
      </svg>
      {children}
    </CassetteContainer>
  )
}

export default TapeSpinner