import {
  Client,
  Expense,
  ExtraExpense,
  FinancialRegistration,
  Prisma,
  PrismaClient,
  Receivable,
} from '@prisma/client'
import { IFinancialRepository } from '../financial'

export class FinancialRepository implements IFinancialRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async createFinancial(userId: string): Promise<FinancialRegistration> {
    return await this.prisma.financialRegistration.create({
      data: {
        userId,
      },
    })
  }

  async getFinancial(userId: string): Promise<FinancialRegistration | null> {
    return await this.prisma.financialRegistration.findFirst({
      where: {
        userId,
      },
    })
  }

  async createClient(params: Client): Promise<Client> {
    return await this.prisma.client.create({ data: params })
  }

  async getClientById(id: string): Promise<Client | null> {
    return await this.prisma.client.findUnique({
      where: {
        id,
      },
    })
  }

  async editClient(
    clientId: string,
    data: Prisma.ClientUncheckedCreateInput,
  ): Promise<Client> {
    return await this.prisma.client.update({
      where: { id: clientId },
      data,
    })
  }

  async deleteClient(clientId: string): Promise<Client> {
    return await this.prisma.client.delete({
      where: { id: clientId },
    })
  }

  async getAllClientByFinancialId(id: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        financialRegistrationId: id,
      },
    })

    return clients
  }

  async createExpenses(params: Expense): Promise<Expense> {
    return await this.prisma.expense.create({ data: params })
  }

  async editExpense(
    expensesId: string,
    data: Prisma.ExpenseUncheckedCreateInput,
  ): Promise<Expense> {
    return await this.prisma.expense.update({
      where: { id: expensesId },
      data,
    })
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return await this.prisma.expense.findUnique({
      where: {
        id,
      },
    })
  }

  async deleteExpense(expenseId: string): Promise<Expense> {
    return await this.prisma.expense.delete({
      where: { id: expenseId },
    })
  }

  async getAllExpenseByFinancialId(id: string): Promise<Expense[]> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        financialRegistrationId: id,
      },
    })

    return expenses
  }

  async createReceivable(params: Receivable): Promise<Receivable> {
    return await this.prisma.receivable.create({ data: params })
  }

  async editReceivable(
    expensesId: string,
    data: Prisma.ReceivableUncheckedCreateInput,
  ): Promise<Receivable> {
    return await this.prisma.receivable.update({
      where: { id: expensesId },
      data,
    })
  }

  async getReceivableById(id: string): Promise<Receivable | null> {
    return await this.prisma.receivable.findUnique({
      where: {
        id,
      },
    })
  }

  async deleteReceivable(receivableId: string): Promise<Receivable> {
    return await this.prisma.receivable.delete({
      where: { id: receivableId },
    })
  }

  async getAllReceivableByFinancialId(id: string): Promise<Receivable[]> {
    const receivables = await this.prisma.receivable.findMany({
      where: {
        financialRegistrationId: id,
      },
    })

    return receivables
  }

  async createExtraExpense(
    params: Prisma.ExtraExpenseUncheckedCreateInput,
  ): Promise<ExtraExpense> {
    return await this.prisma.extraExpense.create({ data: params })
  }

  async editExtraExpense(
    extraExpenseId: string,
    data: Prisma.ExtraExpenseUncheckedCreateInput,
  ): Promise<ExtraExpense> {
    return await this.prisma.extraExpense.update({
      where: { id: extraExpenseId },
      data,
    })
  }

  async getExtraExpenseById(id: string): Promise<ExtraExpense | null> {
    return await this.prisma.extraExpense.findUnique({
      where: {
        id,
      },
    })
  }

  async deleteExtraExpense(extraExpenseId: string): Promise<ExtraExpense> {
    return await this.prisma.extraExpense.delete({
      where: { id: extraExpenseId },
    })
  }

  async getAllExtraExpenseByFinancialId(id: string): Promise<ExtraExpense[]> {
    const extraExpenses = await this.prisma.extraExpense.findMany({
      where: {
        financialRegistrationId: id,
      },
    })

    return extraExpenses
  }
}
