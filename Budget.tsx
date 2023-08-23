/** @format */

import dayjs from 'dayjs';

/**
 * ### 查詢預算
 * - local 時區
 * - 設定起迄時間，但查詢區間以天為單位
 * - 以年月為單位，沒有設定就為 0
 *     - 欄位 => yearMonth, amount / 202308, $31,000
 *     - 假設查到 20230801 - 20230810 -> $31,000 / 31 * 10 = $10,000 無法整除就是小數點第二位
 * - 涵蓋得預算總額，不論是否使用過
 * //
 * BudgetRepo , getAll(),
 * 驗收條件
 * 5.30
 * @format
 */
export type BudgetType = {
	yearMonth: string;
	amount: number;
};

export class BudgetService {
	constructor() {}

	getAll = (): BudgetType[] => {
		return [];
	};

	totalAmount = (startDate: Date, endDate: Date) => {
		const start = dayjs(startDate);
		const end = dayjs(endDate);
		const startYearMonth = start.format('YYYYMM');
		const endYearMonth = end.format('YYYYMM');
		let data = this.getAll();

		if (!data) {
			return 0;
		}

		if (start.isAfter(end)) {
			return 0;
		}

		const budgetData = data.filter(
			(item) =>
				start.isSame(item.yearMonth, 'month') ||
				start.isBefore(item.yearMonth, 'month') ||
				end.isSame(item.yearMonth, 'month') ||
				end.isAfter(item.yearMonth, 'month')
		);

		const total = budgetData.reduce((sum, current) => {
			const monthLength = dayjs(current.yearMonth).daysInMonth();
			const dayAmount = current.amount / monthLength;
			if (startYearMonth === endYearMonth) {
				const diff = end.diff(start, 'day') + 1;
				return (sum += dayAmount * diff);
			}
			if (current.yearMonth === startYearMonth) {
				const diff = monthLength - start.date() + 1;
				return (sum += dayAmount * diff);
			}
			if (current.yearMonth === endYearMonth) {
				const diff = end.date();
				return (sum += dayAmount * diff);
			}
			return (sum += current.amount);
		}, 0);

		return total;
	};
}
