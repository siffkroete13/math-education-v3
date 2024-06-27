class LoadModel {
    async loadFromUrl(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load model from ${url}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
}

export { LoadModel };