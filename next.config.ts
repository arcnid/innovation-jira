import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	/* configure implicit any*/
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
