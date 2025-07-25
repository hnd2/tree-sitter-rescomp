// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterRescomp",
    products: [
        .library(name: "TreeSitterRescomp", targets: ["TreeSitterRescomp"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterRescomp",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterRescompTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterRescomp",
            ],
            path: "bindings/swift/TreeSitterRescompTests"
        )
    ],
    cLanguageStandard: .c11
)
