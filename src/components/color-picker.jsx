import { ChromePicker } from "react-color";
import { Saturation } from "react-color/lib/components/common";

export const ColorPicker = ({ selectedCell, color, setColor, onChangeComplete, colorPickerRef, closeColorPicker, handlePaintSubmit }) => {
  return (
    <div className="color-picker" ref={colorPickerRef}>
      {selectedCell && (
        <div className="selected-cell">
          <table>
            <tbody>
              <tr>
                <td>Cell ID:</td>
                <td>{selectedCell.id}</td>
              </tr>
              <tr>
                <td>Owner:</td>
                <td>{selectedCell.owner.substring(0, 12) || 'Be the first one!'}</td>
              </tr>
              <tr>
                <td>Color:</td>
                <td>{selectedCell.color}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <p className="title">PICK A COLOR</p>
      <ChromePicker
        color={color}
        onChange={(updatedColor) => setColor(updatedColor.hex)}
        onChangeComplete={(color) => onChangeComplete(color.hex)}
        disableAlpha={true}
        styles={{
          default: {
            picker: {
              padding: 0,
              background: '#1d1d1d',
            },
          }
        }}
      />
      <div className="buttons">
        <button className="cancel" onClick={closeColorPicker}>CANCEL</button>
        <button className="submit" onClick={handlePaintSubmit}>TAKE OVER</button>
      </div>
    </div>
  );
}