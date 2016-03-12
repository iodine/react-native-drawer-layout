import React from 'react-native';

import DrawerLayout from '../src/DrawerLayout.ios';
import { describe } from 'mocha';
import { expect } from 'chai';
import { it } from 'mocha';
import { shallow } from 'enzyme';

const {
  Text,
} = React;

const DEFAULT_PROPS = {
  drawerPosition: DrawerLayout.positions.Left,
  drawerWidth: 300,
  renderNavigationView: () => (
    <Text>Empty</Text>
  ),
};

describe('<DrawerLayout />', () => {
  it('should render', () => {
    const wrapper = shallow(<DrawerLayout {...DEFAULT_PROPS} />);
    expect(wrapper.length).to.equal(1);
  });
});
