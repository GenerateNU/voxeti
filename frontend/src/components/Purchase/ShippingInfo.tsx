import { Job, Coordinates } from "../../main.types"

export default function ShippingInfo(props: { job: Job }) {

    const getStaticMapUrl = (coordinates: Coordinates) => {
        const G_MAPS_API_KEY = "AIzaSyAP5_5mbMLn34q2B_UHDM4MHsbfb82ZTZM"
        const ZOOM_LEVEL = 17
        const ZOOM = `zoom=${ZOOM_LEVEL}`
        const WIDTH = 400
        const HEIGHT = 200
        const SIZE = `size=${WIDTH}x${HEIGHT}`
        const TYPE = 'roadmap'
        const MAPTYPE = `maptype=${TYPE}`
        const MARKER_COLOR = 'red'
        const MARKERS = `markers=color:${MARKER_COLOR}%7C${coordinates.latitude},${coordinates.longitude}`
        const KEY = `key=${G_MAPS_API_KEY}`

        return `https://maps.googleapis.com/maps/api/staticmap?${ZOOM}&${SIZE}&${MAPTYPE}&${MARKERS}&${KEY}`
    }

    const DeliveryLocation = () => {
        return (
            <div className="flex flex-col">
                <p className="text-base pb-1">Delivery Location</p>
                <p className="text-base opacity-50">{props.job.shippingAddress.line1}</p>
                <p className="text-base opacity-50">{props.job.shippingAddress.line2}</p>
                <p className="text-base opacity-50">{props.job.shippingAddress.city}, {props.job.shippingAddress.state} {props.job.shippingAddress.zipCode}</p>
            </div>
        )
    }

    const EstimatedDelivery = () => {
        return (
            <div className="flex flex-col">
                <p className="text-base pb-1">Estimated Delivery</p>
                <p className="text-base opacity-50">September 30, 2021</p>
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
                {props.job.shippingAddress.location && <img src={getStaticMapUrl(props.job.shippingAddress.location)} />}
            </div>
        </div>
    );
}
