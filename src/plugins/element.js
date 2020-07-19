import Vue from 'vue'
import {
  MessageBox,
  Dialog,
  Pagination,
  Tooltip,
  Switch,
  Table,
  TableColumn,
  Col,
  Row,
  Card,
  BreadcrumbItem,
  Breadcrumb,
  Menu,
  Submenu,
  MenuItem,
  Container,
  Header,
  Aside,
  Main,
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
