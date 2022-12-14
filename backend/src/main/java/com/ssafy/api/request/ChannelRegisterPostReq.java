package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ApiModel("ChannelRegisterPostReq")
public class ChannelRegisterPostReq {
    @ApiModelProperty(name="채널 이름", example="new Channel")
    @NotBlank
    String channelName;
    @ApiModelProperty(name="간단한 채널 소개", example="Channel Description")
    String channelDesc;
    @ApiModelProperty(name="채널 태그", example="Channel Tag")
    String channelTag;
    @ApiModelProperty(name="채널 비밀번호(비공개 방일 경우)", example="Channel Password(nullable)")
    String channelPassword;
    String channelImageId;
}
