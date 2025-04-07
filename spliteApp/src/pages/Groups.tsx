import AddExpenseForm from "../components/AddExpenseForm";
import CreateGroup from "../components/CreateGroup";
import GroupList from '../components/GroupList';

const Groups = () => {
  return (
    <div>
      <CreateGroup />
       <AddExpenseForm/>
       <GroupList/>
    </div>
  );
};

export default Groups;
