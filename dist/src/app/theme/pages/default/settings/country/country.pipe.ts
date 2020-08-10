import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'country'
})
export class CountryPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.CountryName.toLowerCase().includes(searchText);
        });
    }

}