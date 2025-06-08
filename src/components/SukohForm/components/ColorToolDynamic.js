import * as React from 'react';
import DefaultWrapper from './shared/DefaultWrapper';
import FormItemWrapper from './shared/FormItemWrapper';
import Tip from '../../Tip';
import { MuiColorInput } from 'mui-color-input';
import { BaseDynamic } from '../../HoForm';
//import service                              from './../../../services/service'


const palette = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: 'yellow',
  cyan: 'cyan',
  lime: 'lime',
  gray: 'gray',
  orange: 'orange',
  purple: 'purple',
  black: 'black',
  white: 'white',
  pink: 'pink',
  darkblue: 'darkblue',
};
class ColorToolDynamic extends BaseDynamic {

  getType(){
    return 'color';
  }

  handleChange = (color)=>{
    let {context} = this.props;
    let {node} = context;
    let {field} = node;

    if(color){
      context.setValue(color, 250);

      if(field.autoSave === true){
        context.saveFormHandler();
      }

      this.forceUpdate();
    }
  }

  renderComponent(){

    let {context} = this.props;
    let {node, currentPath, parentPath} = context;
    let {field} = node;

    if(currentPath!==parentPath){
      return (null);
    }

    let iconButtons = [];

    if(field.tip){
      iconButtons.push(<Tip markdown={field.tip} />);
    }

    return (
      <FormItemWrapper
      control={
        <React.Fragment>
          <DefaultWrapper>
            <label style={{

              alignSelf: 'stretch',
              display:'block',
              lineHeight: '22px',
              fontSize:12,
              pointerEvents: 'none',
              userSelect: 'none',
               }}>{field.title}</label>

            <MuiColorInput
            value={context.value || '#000000'}
            onChange={ this.handleChange }
            format="hex"
          />
            </DefaultWrapper>
          </React.Fragment>
      }

          iconButtons={iconButtons}
        />);
  }
}

export default ColorToolDynamic;
