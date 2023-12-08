import { Address, Geometry } from "../../main.types"

export default function ShippingInfo(props: { shippingAddress: Address, estimatedDelivery?: string }) {

    const getStaticMapUrl = (geometry: Geometry) => {
        const G_MAPS_API_KEY = import.meta.env.VITE_G_MAPS_API_KEY
        const ZOOM_LEVEL = 17
        const ZOOM = `zoom=${ZOOM_LEVEL}`
        const WIDTH = 400
        const HEIGHT = 200
        const SIZE = `size=${WIDTH}x${HEIGHT}`
        const TYPE = 'roadmap'
        const MAPTYPE = `maptype=${TYPE}`
        const MARKER_COLOR = 'red'
        const MARKERS = `markers=color:${MARKER_COLOR}%7C${geometry.coordinates[1]},${geometry.coordinates[0]}`
        const KEY = `key=${G_MAPS_API_KEY}`

        return `https://maps.googleapis.com/maps/api/staticmap?${ZOOM}&${SIZE}&${MAPTYPE}&${MARKERS}&${KEY}`
    }

    const DeliveryLocation = () => {
        return (
            <div className="flex flex-col">
                <p className="text-base pb-1">Delivery Location</p>
                <p className="text-base opacity-50">{props.shippingAddress.line1}</p>
                <p className="text-base opacity-50">{props.shippingAddress.line2}</p>
                <p className="text-base opacity-50">{props.shippingAddress.city}, {props.shippingAddress.state} {props.shippingAddress.zipCode}</p>
            </div>
        )
    }

    const FormatDateString = (dateStr: string): string => {
        const dateObj = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    };

    const EstimatedDelivery = () => {
        const ZERO_DATE_STR = "0001-01-01T00:00:00Z"
        return (
            <div className="flex flex-col">
                <p className="text-base pb-1">Estimated Delivery</p>
                {
                    props.estimatedDelivery && props.estimatedDelivery !== ZERO_DATE_STR ?
                        <p className="text-base opacity-50">{FormatDateString(props.estimatedDelivery)}</p>
                        :
                        <p className="text-base opacity-50">Not Available</p>
                }
            </div>
        )
    }

    return (
        <div className="flex justify-between">
            <div className="flex flex-col justify-between">
                <DeliveryLocation />
                <EstimatedDelivery />
            </div>
            <div>
                {props.shippingAddress.location && <img src={getStaticMapUrl(props.shippingAddress.location)} />}
            </div>
        </div>
    );
}
