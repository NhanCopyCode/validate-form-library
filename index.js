export default class LocationSelector {
    constructor(apiBaseUrl, provinceElement, districtElement, wardElement) {
        this.apiBaseUrl = apiBaseUrl;
        this.provinceElement = document.querySelector(provinceElement);
        this.districtElement = document.querySelector(districtElement);
        this.wardElement = document.querySelector(wardElement);

        this.init();
    }

    init() {
        const provinceId = this.provinceElement?.dataset.value || null;
        if (provinceId) {
            this.loadDistricts(provinceId);
        }

        const wardId = this.wardElement?.dataset.value || null;

        this.loadProvinces(provinceId, wardId);

        this.provinceElement?.addEventListener("change", () =>
            this.onProvinceChange()
        );
        this.districtElement?.addEventListener("change", () =>
            this.onDistrictChange()
        );
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            throw error;
        }
    }

    async loadProvinces(provinceId = null, wardId = null) {
        try {
            const data = await this.fetchData(`${this.apiBaseUrl}/provinces`);
            this.populateSelect(
                this.provinceElement,
                data,
                provinceId,
                "Chọn tỉnh/thành phố"
            );

            if (provinceId) {
                await this.loadDistricts(provinceId, wardId);
            }
        } catch (error) {
            alert("Lỗi khi lấy dữ liệu tỉnh/thành phố.");
        }
    }

    async loadDistricts(provinceId, wardId = null) {
        try {
            const data = await this.fetchData(
                `${this.apiBaseUrl}/districts/${provinceId}`
            );
            this.populateSelect(
                this.districtElement,
                data,
                null,
                "Chọn quận/huyện"
            );

            if (wardId) {
                await this.loadWards(wardId);
            }
        } catch (error) {
            alert("Lỗi khi lấy dữ liệu quận/huyện.");
        }
    }

    async loadWards(districtId) {
        try {
            const data = await this.fetchData(
                `${this.apiBaseUrl}/wards/${districtId}`
            );
            this.populateSelect(this.wardElement, data, null, "Chọn xã/phường");
        } catch (error) {
            alert("Lỗi khi lấy dữ liệu xã/phường.");
        }
    }

    populateSelect(
        selectElement,
        data,
        selectedValue = null,
        placeholder = "Chọn"
    ) {
        if (!selectElement) return;
        selectElement.innerHTML = "";
        const placeholderOption = document.createElement("option");
        placeholderOption.textContent = placeholder;
        placeholderOption.value = "";
        selectElement.appendChild(placeholderOption);

        data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            if (selectedValue && item.id == selectedValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    onProvinceChange() {
        const provinceId = this.provinceElement.value;
        this.districtElement.innerHTML = "";
        this.wardElement.innerHTML = "";
        if (provinceId) {
            this.loadDistricts(provinceId);
        }
    }

    onDistrictChange() {
        const districtId = this.districtElement.value;
        this.wardElement.innerHTML = "";
        if (districtId) {
            this.loadWards(districtId);
        }
    }
}
