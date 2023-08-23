/**
 * ### 查詢預算
 * - local 時區
 * - 設定起迄時間，但查詢區間以天為單位
 * - 以年月為單位，沒有設定就為 0
 *     - 欄位 => yearMonth, amount / 202308, $31,000
 *     - 假設查到 20230801 - 20230810 -> $31,000 / 31 * 10 = $10,000 無法整除就是小數點第二位
 * - 涵蓋得預算總額，不論是否使用過
 * //
 *
 * @format
 */

import { BudgetService, BudgetType } from './Budget';

let budgets: BudgetType[];

describe('Budget Service 無資料', () => {
	it('單日查詢', () => {
		const budgetService = new BudgetService();
		budgetService.getAll = () => [];
		const today = new Date();
		expect(budgetService.totalAmount(today, today)).toBe(0);
	});
});
describe('Budget Service 有資料', () => {
	it('單日查詢', () => {
		const budgetService = new BudgetService();
		budgets = [{ yearMonth: '202308', amount: 31000 }];
		budgetService.getAll = () => budgets;

		const today = new Date();
		expect(budgetService.totalAmount(today, today)).toBe(1000);
	});
	it('同月份多日查詢', () => {
		const budgetService = new BudgetService();
		budgets = [{ yearMonth: '202308', amount: 31 }];
		budgetService.getAll = () => budgets;
		const start = new Date('2023-08-21');
		const today = new Date();

		expect(budgetService.totalAmount(start, today)).toBe(3);
	});
	it('跨月查詢', () => {
		const budgetService = new BudgetService();
		budgets = [
			{ yearMonth: '202307', amount: 310 },
			{ yearMonth: '202308', amount: 3100 },
		];
		budgetService.getAll = () => budgets;
		const start = new Date('2023-07-29'); // 30
		const end = new Date('2023-08-02'); // 200

		expect(budgetService.totalAmount(start, end)).toBe(230);
	});
	it('跨更多月查詢', () => {
		const budgetService = new BudgetService();
		budgets = [
			{ yearMonth: '202306', amount: 30 },
			{ yearMonth: '202307', amount: 310 },
			{ yearMonth: '202308', amount: 3100 },
		];
		budgetService.getAll = () => budgets;
		const start = new Date('2023-06-29'); // 2
		const end = new Date('2023-08-02'); // 200

		expect(budgetService.totalAmount(start, end)).toBe(512);
	});
});
