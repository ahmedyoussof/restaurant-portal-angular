import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';


@Injectable()
export class PromotionService {

  constructor() { }

  getPromotion(): Promotion[] {
    return PROMOTIONS;
  }
  
  getPromotions(id: number): Promotion {
    return PROMOTIONS.filter((promo) => (promo.id === id))[0];
  }

  getFeaturedPromotion(): Promotion {
    return PROMOTIONS.filter((promo) => (promo.featured))[0];
  }

}
