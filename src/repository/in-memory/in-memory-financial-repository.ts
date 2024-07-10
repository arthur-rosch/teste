import {
  Client,
  Expense,
  ExtraExpense,
  FinancialRegistration,
  Receivable,
} from '@prisma/client'
import { IFinancialRepository } from '../financial'

class InMemoryFinancialRepository implements IFinancialRepository {
  private financialRegistrations: FinancialRegistration[] = []
  private clients: Client[] = []
  private expenses: Expense[] = []
  private receivables: Receivable[] = []
  private extraExpenses: ExtraExpense[] = []

  async createFinancial(userId: string): Promise<FinancialRegistration> {
    const financialRegistration = {
      id: Math.random().toString(),
      userId,
    } as FinancialRegistration

    this.financialRegistrations.push(financialRegistration)
    return financialRegistration
  }

  async getFinancial(userId: string): Promise<FinancialRegistration | null> {
    return (
      this.financialRegistrations.find((fr) => fr.userId === userId) || null
    )
  }

  async createClient(params: Client): Promise<Client> {
    this.clients.push(params)
    return params
  }

  async getClientById(id: string): Promise<Client | null> {
    return this.clients.find((client) => client.id === id) || null
  }

  async editClient(clientId: string, data: Client): Promise<Client> {
    const index = this.clients.findIndex((client) => client.id === clientId)
    if (index === -1) {
      throw new Error('Client not found')
    }
    this.clients[index] = { ...this.clients[index], ...data }
    return this.clients[index]
  }

  async deleteClient(clientId: string): Promise<Client> {
    const index = this.clients.findIndex((client) => client.id === clientId)
    if (index === -1) {
      throw new Error('Client not found')
    }
    const [deletedClient] = this.clients.splice(index, 1)
    return deletedClient
  }

  async getAllClientByFinancialId(id: string): Promise<Client[]> {
    return this.clients.filter(
      (client) => client.financialRegistrationId === id,
    )
  }

  async createExpenses(params: Expense): Promise<Expense> {
    this.expenses.push(params)
    return params
  }

  async editExpense(expenseId: string, data: Expense): Promise<Expense> {
    const index = this.expenses.findIndex((expense) => expense.id === expenseId)

    this.expenses[index] = { ...this.expenses[index], ...data }

    return this.expenses[index]
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return this.expenses.find((expense) => expense.id === id) || null
  }

  async deleteExpense(expenseId: string): Promise<Expense> {
    const index = this.expenses.findIndex((expense) => expense.id === expenseId)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    const [deletedExpense] = this.expenses.splice(index, 1)
    return deletedExpense
  }

  async getAllExpenseByFinancialId(id: string): Promise<Expense[]> {
    return this.expenses.filter(
      (expense) => expense.financialRegistrationId === id,
    )
  }

  async createReceivable(params: Receivable): Promise<Receivable> {
    this.receivables.push(params)
    return params
  }

  async editReceivable(
    receivableId: string,
    data: Receivable,
  ): Promise<Receivable> {
    const index = this.receivables.findIndex(
      (receivable) => receivable.id === receivableId,
    )
    if (index === -1) {
      throw new Error('Receivable not found')
    }
    this.receivables[index] = { ...this.receivables[index], ...data }
    return this.receivables[index]
  }

  async getReceivableById(id: string): Promise<Receivable | null> {
    return this.receivables.find((receivable) => receivable.id === id) || null
  }

  async deleteReceivable(receivableId: string): Promise<Receivable> {
    const index = this.receivables.findIndex(
      (receivable) => receivable.id === receivableId,
    )
    if (index === -1) {
      throw new Error('Receivable not found')
    }
    const [deletedReceivable] = this.receivables.splice(index, 1)
    return deletedReceivable
  }

  async getAllReceivableByFinancialId(id: string): Promise<Receivable[]> {
    return this.receivables.filter(
      (receivable) => receivable.financialRegistrationId === id,
    )
  }

  async createExtraExpense(params: ExtraExpense): Promise<ExtraExpense> {
    this.extraExpenses.push(params)
    return params
  }

  async editExtraExpense(
    extraExpenseId: string,
    data: ExtraExpense,
  ): Promise<ExtraExpense> {
    const index = this.extraExpenses.findIndex(
      (extraExpense) => extraExpense.id === extraExpenseId,
    )
    if (index === -1) {
      throw new Error('Extra Expense not found')
    }
    this.extraExpenses[index] = { ...this.extraExpenses[index], ...data }
    return this.extraExpenses[index]
  }

  async getExtraExpenseById(id: string): Promise<ExtraExpense | null> {
    return (
      this.extraExpenses.find((extraExpense) => extraExpense.id === id) || null
    )
  }

  async deleteExtraExpense(extraExpenseId: string): Promise<ExtraExpense> {
    const index = this.extraExpenses.findIndex(
      (extraExpense) => extraExpense.id === extraExpenseId,
    )
    if (index === -1) {
      throw new Error('Extra Expense not found')
    }
    const [deletedExtraExpense] = this.extraExpenses.splice(index, 1)
    return deletedExtraExpense
  }

  async getAllExtraExpenseByFinancialId(id: string): Promise<ExtraExpense[]> {
    return this.extraExpenses.filter(
      (extraExpense) => extraExpense.financialRegistrationId === id,
    )
  }
}

export { InMemoryFinancialRepository }
