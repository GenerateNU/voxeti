import { Address, Geometry } from "../../main.types"

export default function ShippingInfo(props: { shippingAddress: Address, estimatedDelivery: Date }) {

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

    const FormatDate = (date: Date): string => {
        const dateObj = new Date(date);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    };

    const EstimatedDelivery = () => {
        return (
            <div className="flex flex-col">
                <p className="text-base pb-1">Estimated Delivery</p>
                <p className="text-base opacity-50">{FormatDate(props.estimatedDelivery)}</p>
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
