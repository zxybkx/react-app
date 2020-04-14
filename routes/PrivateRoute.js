import Authorized from '@/utils/Authorized';
import { Redirect } from 'umi';

export default class PrivateRoute extends React.PureComponent{

  componentWillMount() {
  }

  render() {
    const {children} = this.props;
    return (
      <Authorized authority={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}
                  noMatch={<Redirect to='/404'/>}>
        {children}
      </Authorized>
    );
  }
}
