import {
  Client,
  Expense,
  ExtraExpense,
  FinancialRegistration,
  Prisma,
  Receivable,
} from '@prisma/client'

export interface IFinancialRepository {
  createFinancial(userId: string): Promise<FinancialRegistration>
  getFinancial(userId: string): Promise<FinancialRegistration | null>

  createClient(params: Partial<Client>): Promise<Client>
  getClientById(id: string): Promise<Client | null>
  deleteClient(clientId: string): Promise<Client>
  editClient(
    clientId: string,
    data: Prisma.ClientUncheckedCreateInput,
  ): Promise<Client>
  getAllClientByFinancialId(id: string): Promise<Client[]>

  createExpenses(params: Partial<Expense>): Promise<Expense>
  getExpenseById(id: string): Promise<Expense | null>
  deleteExpense(expenseId: string): Promise<Expense>
  editExpense(
    expenseId: string,
    data: Prisma.ExpenseUncheckedCreateInput,
  ): Promise<Expense>
  getAllExpenseByFinancialId(id: string): Promise<Expense[]>

  createReceivable(
    data: Prisma.ReceivableUncheckedCreateInput,
  ): Promise<Receivable>
  getReceivableById(id: string): Promise<Receivable | null>
  deleteReceivable(receivableId: string): Promise<Receivable>
  editReceivable(
    receivableId: string,
    data: Prisma.ReceivableUncheckedCreateInput,
  ): Promise<Receivable>
  getAllReceivableByFinancialId(id: string): Promise<Receivable[]>

  createExtraExpense(
    data: Prisma.ExtraExpenseUncheckedCreateInput,
  ): Promise<ExtraExpense>
  getExtraExpenseById(id: string): Promise<ExtraExpense | null>
  deleteExtraExpense(extraExpenseId: string): Promise<ExtraExpense>
  editExtraExpense(
    extraExpenseId: string,
    data: Prisma.ExtraExpenseUncheckedCreateInput,
  ): Promise<ExtraExpense>
  getAllExtraExpenseByFinancialId(id: string): Promise<ExtraExpense[]>
}
