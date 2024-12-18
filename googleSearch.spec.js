const { readExcel, writeExcel } = require("../../excelUtils");
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const filePath = "data.xlsx";

describe("Google Search Automation", () => {
    const today = new Date();
    const currentDay = dayNames[today.getDay()]; // e.g., "Monday"

    it("Extracts longest and shortest suggestions for today's keywords", () => {
        const data = readExcel(filePath, currentDay);

        const results = data.map(([keyword, ...rest]) => {
            if (!keyword) return [keyword, ...rest]; // Skip empty rows

            cy.visit("https://www.google.com");
            cy.get('input[name="q"]').type(`${keyword}{enter}`);

            cy.get('ul[role="listbox"] li span').then((elements) => {
                const suggestions = [...elements].map(el => el.textContent);
                const longest = suggestions.reduce((a, b) => (a.length > b.length ? a : b), "");
                const shortest = suggestions.reduce((a, b) => (a.length < b.length ? a : b), "");
                return [keyword, longest, shortest];
            });
        });

        cy.wrap(results).then((finalData) => {
            writeExcel(filePath, currentDay, finalData);
        });
    });
});
