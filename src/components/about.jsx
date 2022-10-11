import { useEffect, useRef } from "react"

export const About = ({ showAbout, setShowAbout }) => {
  return (
    <div className={`about ${showAbout && 'slideIn'}`} >
      <div>
        <p><strong>Welcome!</strong></p>
        <p>Thanks for your interest in the banner-sandbox! </p>
        <p>Draw my next Twitter profile!</p>
        <p><strong>How does it work?</strong></p>
        <ul>
          <li>
            <p>Click on a cell to select it 🎯</p>
          </li>
          <li>
            <p>Choose a color from the color picker 🎨</p>
          </li>
          <li>
            <p>Click on the "TAKE OVER" button to paint the cell 🧑‍🎨</p>
          </li>
          <li>
            <p>Repeat until you're happy with the result 😁</p>
          </li>
        </ul>
        <p><strong>Rules</strong></p>
        <ul>
          <li>
            <p>You can only paint a cell if you have enough paints 🥹</p>
          </li>
          <li>
            <p>You can use only 5 paints. Then you have to wait for 3 minutes ⏰</p>
          </li>
          <li>
            <p>You can paint any cell. Even if it's already taken 😏</p>
          </li>
          <li>
            <p>Don't be a jerk. Please draw only socially aceeptable stuff 🔞</p>
          </li>
        </ul>
      </div>

      <button className="about-btn cancel" onClick={() => setShowAbout(!showAbout)}>CLOSE</button>
    </div>
  )
}