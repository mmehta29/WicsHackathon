export default function CameraView({ videoRef }) {
    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
        />
    )
}