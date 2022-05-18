import {$host} from "./index";


export const axiosGetCars = async (data =
                                       {
                                           amount: 15000,
                                           body: [],
                                           color: [],
                                           drive: [],
                                           engine: {},
                                           location: [],
                                           model: {},
                                           page: 0,
                                           state: [],
                                           transmission: [],
                                           year: [],
                                           price: []
                                       },) => {
    return await $host.post('/car-in-stock/get-cars', data)
}