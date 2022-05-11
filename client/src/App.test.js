import renderer from 'react-test-renderer';
import App from './App';

it('Testing App component', () => {
  const appComponent = renderer.create(
    <App />,
  );

  let tree = appComponent.toJSON();
  expect(tree).toMatchSnapshot();
});
