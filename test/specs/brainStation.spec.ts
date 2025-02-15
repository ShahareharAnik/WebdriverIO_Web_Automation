
import brainStationActions from '../Actions/brainStationActions';


describe('BrainStation 23 Page Automation', () => {
    it ('Open Browser',async () => {
        await brainStationActions.openHomepage();
        await browser.pause(5000);
        console.log('Test: Open Browser');
    });

    it('Title Verified', async () => {
        await brainStationActions.verifyTitle();
    });

    it('Scroll to the search', async () => {
        await brainStationActions.scrollToSearch();
    });

    it('Search something', async () => {
        await brainStationActions.searchFor('Web Development');
    });
});

