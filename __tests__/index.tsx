import * as React from 'react';
import { mount } from 'enzyme';
import { keybind } from '../src';

interface State {
  ans: string;
}

class C extends React.Component<{}, State> {
  state: State;

  constructor() {
    super();

    this.state = { ans: '' };

    Reflect.apply(this.esc, this, []);
  }

  @keybind('esc')
  esc() {
    this.setState({ ans: 'esc' });
  }

  render() {
    return <span id="res">{this.state.ans}</span>;
  }
}

test.skip('press ESC key', () => {
  const wrapper = mount(<C />);

  // expect(wrapper.find('#res').props().children).toBe('');
  wrapper.simulate('keyDown', {
    key: 'Escape'
  });

  expect(wrapper.find('#res').props().children).toBe('');
});
