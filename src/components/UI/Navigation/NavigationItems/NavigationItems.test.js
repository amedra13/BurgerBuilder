import React from 'react'

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavItem from './NavItem/NavItem';

configure({adapter: new Adapter()})

describe('<NavigationItems />', () => {
    it( ' should render two <NavItem /> elements if not authenticated', () => {
        const wrapper = shallow(<NavigationItems/>);
        expect(wrapper.find(NavItem)).toHaveLength(2)
    })
})