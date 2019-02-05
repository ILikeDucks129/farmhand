import React from 'react';
import FieldTools from './FieldTools';
import Item from '../Item';
import { shallow } from 'enzyme';

let component;

const getFieldTools = (props = {}) => (
  <FieldTools
    {...{
      handlers: {
        handleFieldToolSelect: () => {},
        ...props.handlers,
      },
      state: {
        fieldToolInventory: [],
        selectedFieldToolId: '',
        ...props.state,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(
    getFieldTools({
      state: {
        fieldToolInventory: [{ quantity: 1, id: 'sample-field-tool-1' }],
        selectedFieldToolId: 'sample-field-tool-1',
      },
    })
  );
});

describe('rendering', () => {
  it('renders items for provided inventory', () => {
    expect(component.find(Item)).toHaveLength(1);
  });

  it('renders selected item state', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});