import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useExpenseStore from '../store/useExpenseStore';

const useSubmitExpense = () => {
  const queryClient = useQueryClient();
  const {
    selectedGroup,
    payer,
    description,
    amount,
    splitAmounts,
    resetForm,
  } = useExpenseStore();

  return useMutation({
    mutationFn: async () => {
      if (!selectedGroup || !payer || !description || amount <= 0 || splitAmounts.length === 0) return;
      await axios.post('http://localhost:5001/expenses/addexp', {
        groupId: selectedGroup._id,
        payerId: payer,
        description,
        amount,
        splitAmount: splitAmounts,
      });
    },
    onSuccess: () => {
      resetForm();
    if (selectedGroup?._id) {
      queryClient.invalidateQueries({ queryKey: ["Expenses", selectedGroup._id] });
    }
    },
  });
};

export default useSubmitExpense;
