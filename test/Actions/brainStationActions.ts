import brainStationObjects from '../../src/pageobjects/brainStation';

class brainStationActions {

    async openHomepage() {
        await brainStationObjects.url;
       // report.addStep('its open homepage');
    }
    async verifyTitle() {
        await expect(browser).toHaveTitle('Brain Station 23 | Professionals @ Your Service');
        
    }

    async scrollToSearch() {
        await brainStationObjects.homepagesearch.scrollIntoView();
    }

    async searchFor(term: string) {
        await brainStationObjects.homepagesearch.setValue(term);
        await brainStationObjects.searchButton.click();
    }
}
export default new brainStationActions();